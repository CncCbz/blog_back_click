const { toRegister } = require('./register');
const { toLogin } = require('./login');
const { getRoles } = require('./role');
const { getUsers, editUser, deleteUser, deleteUsers, addUser } = require('./user');
const { getGhsConfig, checkVideoList, getVidoUrl } = require('./ghs');
const { issueArticle, getArticleList, deleteArticle, getArticle, updateArticle, updateDraft, getDraft, deleteDraft } = require('./article');
const { uploadImg } = require('./upload');
const { getLogs } = require('./log');
const { getVisitors } = require('./home');

module.exports = {
  toRegister,
  toLogin,
  getRoles,
  getUsers,
  editUser,
  deleteUser,
  deleteUsers,
  addUser,
  getGhsConfig,
  checkVideoList,
  getVidoUrl,
  issueArticle,
  getArticleList,
  deleteArticle,
  getArticle,
  updateArticle,
  updateDraft,
  getDraft,
  deleteDraft,
  uploadImg,
  getLogs,
  getVisitors
};
