const config = require('config');
const ffmpeg = require('ffmpeg');
const moment = require('moment');
const fs = require('fs');
const db = require('../../../../library/sequelize-cli/models/index');
const userMediaDetails = db.user_media_details;
const userTeamJoinTable = db.join_table_users_teams;
const logger = require('../../../utils/logger');

class UploadLibs {

    isUserBelongsToTeam(userId, teamId) {
        return new Promise((resolve, reject) => {
            if (!userId || !teamId) {
                reject(new Error("Invalid Inputs"));
            } else {
                userTeamJoinTable.findOne({
                    where: {
                        team_id: teamId,
                        user_id: userId,
                        left_from_team: 0
                    }
                })
                    .then((response) => {
                        if (!response)
                            reject(new Error("Sorry, you are not a part of the team!"));
                        resolve(true);
                    })
                    .catch(() => {
                        reject(new Error("Sorry, you are not a part of the team!"));
                    });
            }
        });
    }


    isTeamValidForUser(userId, teamId) {

        return new Promise((resolve, reject) => {
            return userTeamJoinTable.findOne({
                where: {
                    user_id: userId,
                    team_id: teamId,
                    left_from_team: false
                },
                attributes: ['id', 'user_id']
            })
                .then((result) => {
                    if (result) resolve();
                    else throw new Error("User not belongs to the team!");
                })
                .catch((error) => {
                    reject(error);
                });
        });


    }


    generateWaterMark(imagefilePath) {
        return new Promise((resolve, reject) => {
            if (!imagefilePath) {
                reject(new Error("Invalid Inputs"));
            } else {
                var ffmpegWatermarkObject = new ffmpeg(String(imagefilePath));
                var waterFile = `${config.get('uploadService.thumbnail_path')}/wm${moment().unix()}.jpg`;
                ffmpegWatermarkObject.then((video) => {
                    video.fnAddWatermark(config.get('uploadService.assert'), waterFile, {
                        position: 'C'
                    })
                        .then(() => {
                            resolve(waterFile.replace(config.get('uploadService.thumbnail_path'), ''));
                        })
                        .catch((error) => {
                            throw error;
                        });
                })
                    .catch(() => {
                        reject(false);
                    });
            }
        });
    }

    generateThumbnail(videoFilePath) {
        return new Promise((resolve, reject) => {
            if (!videoFilePath) {
                reject(new Error("Invalid Inputs"));
            } else {
                var ffmpegObject = new ffmpeg(videoFilePath);
                var thumbnailFileName = moment().unix();
                var thumbnailFile = `${config.get('uploadService.thumbnail_path')}/thumb_${thumbnailFileName}.jpg`;
                logger.info(thumbnailFile);
                return ffmpegObject
                    .then((video) => {

                        video.fnExtractFrameToJPG(config.get('uploadService.thumbnail_path'), {
                            frame_rate: 3,
                            number: 1,
                            file_name: thumbnailFile
                        })
                            .then((files) => {
                                var thumbnail = files.filter(x => x.includes(thumbnailFileName));
                                resolve(thumbnail);
                            })
                            .catch((error) => {
                                throw error;
                            });
                    })
                    .catch((error) => {
                        reject(error.message);
                    });
            }
        });
    }

    uploadMedia(userId, teamId, privacy, files) {
        return new Promise((resolve, reject) => {
            if (!userId || !teamId || !privacy) {
                reject(new Error("Invalid Input"));
            } else {
                const fileExistsStatus = fs.existsSync(config.get('uploadService.thumbnail_path'));
                if (!fileExistsStatus)
                    fs.mkdirSync(config.get('uploadService.thumbnail_path'));

                var mediaDetails = [];
                return this.isUserBelongsToTeam(userId, teamId)
                    .then(() => {
                        return Promise.all(files.map((file) => {
                            if (file.mimetype.includes('image')) {
                                var fileDetails = {
                                    type: 0,
                                    privacy_type: privacy,
                                    user_id: userId,
                                    team_id: teamId,
                                    media_size: file.size,
                                    file_name: file.filename,
                                    mime_type: file.mimetype,
                                    media_url: `/images/${file.filename}`,
                                    thumbnail_url: `/images/${file.filename}`,
                                };
                                mediaDetails.push(fileDetails);
                                return;
                            }
                            else {
                                var thumb_image = '';

                                return this.generateThumbnail(`${config.get('uploadService.video_path')}/${file.filename}`)
                                    .then((thumbnail) => {
                                        thumb_image = thumbnail;
                                        return this.generateWaterMark(thumbnail)
                                            .then((waterMarkFile) => {
                                                var isThumbnailUrlExists = fs.existsSync(String(thumb_image));
                                                if (isThumbnailUrlExists) {
                                                    fs.unlink(String(thumb_image), (error) => {
                                                        if (error)
                                                            logger.info(error);
                                                    });
                                                }
                                                return waterMarkFile;
                                            })
                                            .catch((error) => {
                                                logger.info(error.message);
                                                throw error;
                                            });
                                    })
                                    .then((thumbnailUrl) => {
                                        var fileDetails = {
                                            type: 1,
                                            privacy_type: privacy,
                                            user_id: userId,
                                            team_id: teamId,
                                            media_size: file.size,
                                            file_name: file.filename,
                                            mime_type: file.mimetype,
                                            media_url: `/videos/${file.filename}`,
                                            thumbnail_url: `/thumbnails${thumbnailUrl}`
                                        };
                                        mediaDetails.push(fileDetails);
                                        return;
                                    })
                                    .catch((error) => {
                                        logger.info(error.message);
                                    });
                            }
                        }));
                    })
                    .then(() => {
                        return userMediaDetails.bulkCreate(mediaDetails, { returning: true });
                    })
                    .then((details) => {
                        resolve(details);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        });
    }

    getUserMediaDetails(userId, teamId, privacy, pageId) {
        return new Promise((resolve, reject) => {
            if (!userId || !teamId || !privacy)
                reject(new Error("Invalid Inputs"));
            else if ((privacy >= 3 || privacy < 0))
                reject(new Error("Please check the privacy type whether between 0-2."));
            else if (pageId < 0)
                reject(new Error("Please check pageId greater than 0"));
            else {
                var conditions = { user_id: Number(userId) };

                if (privacy == 0 || privacy == 1)
                    conditions.privacy_type = Number(privacy);

                if (teamId && teamId != -1)
                    conditions.team_id = Number(teamId);

                var offset = Number((pageId - 1) * config.get('perPageLimit'));

                var limit = config.get('perPageLimit');

                return this.isTeamValidForUser(userId, teamId)
                    .then(() => {
                        return userMediaDetails.findAll({
                            where: conditions,
                            attributes: ['id', 'team_id', 'privacy_type', 'media_size', 'file_name', 'mime_type', 'media_url', 'thumbnail_url', 'created_date'],
                            order: [['created_date', 'DESC']],
                            offset: offset,
                            limit: limit,
                        });
                    })
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        });

    }

    deleteUserMedia(isForceDelete, userId, mediaId) {
        return new Promise((resolve, reject) => {
            if (!userId || !mediaId) {
                reject(new Error("Invalid Inputs"));
            } else {

                logger.info(`Is Force Deleted : ${isForceDelete}  and False Condition: ${isForceDelete == 1} and True Condition: ${isForceDelete == 0}`);

                if (isForceDelete == 1) {
                    var media_url = null;
                    var thumbnail = null;
                    return userMediaDetails.findOne({
                        where: {
                            id: mediaId,
                            user_id: userId
                        }
                    })
                        .then((data) => {
                            if (!data)
                                throw new Error("No such media found!");

                            if (data.dataValues.mime_type == "video/mp4")
                                media_url = `${config.get('uploadService.basePath')}/${data.dataValues.media_url}`;
                            else
                                media_url = `${config.get('uploadService.basePath')}/${data.dataValues.media_url}`;

                            // var media_url = `${ config.get('uploadService.video_path') } / ${ data.dataValues.media_url }`;
                            thumbnail = `${config.get('uploadService.thumbnail_path')}/${data.dataValues.thumbnail_url}`;

                            var isMediaUrlExists = fs.existsSync(media_url);
                            if (isMediaUrlExists) {
                                fs.unlink(media_url, (error) => {
                                    if (error)
                                        logger.info(error.message);
                                });
                            }
                            var isThumbnailUrlExists = fs.existsSync(thumbnail);
                            if (isThumbnailUrlExists) {
                                fs.unlink(thumbnail, (error) => {
                                    if (error)
                                        logger.info(error.message);
                                });
                            }
                            return;
                        })
                        .then(() => {
                            return userMediaDetails.destroy({
                                where: {
                                    id: mediaId,
                                    user_id: userId
                                }
                            })
                                .then((data) => {
                                    if (!data)
                                        throw new Error("No such media found!");
                                    else
                                        resolve("Media has been deleted successfully!");
                                })
                                .catch((error) => {
                                    throw new Error(error.message);
                                });
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
                else if (isForceDelete == 0) {
                    return userMediaDetails.destroy({
                        where: {
                            id: mediaId,
                            user_id: userId
                        }
                    })
                        .then((data) => {
                            if (!data)
                                throw new Error("No such media found!");
                            resolve("Media has been deleted successfully!");
                        })
                        .catch((error) => {
                            reject(error);
                        });
                } else {
                    reject(new Error("Invalid isForceDelete value!"));
                }
            }
        });
    }

}


module.exports = UploadLibs;