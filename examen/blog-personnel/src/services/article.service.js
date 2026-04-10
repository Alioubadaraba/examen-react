import { api } from './api.service';

export const articleService = {
  getAll: () => api.get('/articles'),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
};

export const commentService = {
  getByArticle: (articleId) => api.get(`/articles/${articleId}/comments`),
  create: (articleId, data) => api.post(`/articles/${articleId}/comments`, data),
  delete: (articleId, commentId) =>
    api.delete(`/articles/${articleId}/comments/${commentId}`),
};

export const friendService = {
  getAll: () => api.get('/friends'),
  getPending: () => api.get('/friends/pending'),
  sendRequest: (username) => api.post('/friends/request', { username }),
  accept: (id) => api.put(`/friends/${id}/accept`),
  reject: (id) => api.put(`/friends/${id}/reject`),
  remove: (id) => api.delete(`/friends/${id}`),
  block: (id) => api.put(`/friends/${id}/block`),
  unblock: (id) => api.put(`/friends/${id}/unblock`),
  search: (username) => api.get(`/users/search?username=${username}`),
};
export const likeService = {
  toggle: (articleId) => api.post(`/articles/${articleId}/like`),
  getLikes: (articleId) => api.get(`/articles/${articleId}/likes`),
};