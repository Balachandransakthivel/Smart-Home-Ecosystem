import api from './api';
export default {
  createHousehold: (name: string) => api.post('/household/create', { name }),
  joinHousehold: (inviteCode: string) => api.post('/household/join', { inviteCode }),
  getMembers: () => api.get('/household/members'),
  removeMember: (memberId: string) => api.post('/household/remove-member', { memberId }),
  getInviteCode: () => api.get('/household/invite-code'),
  updateRole: (memberId: string, role: string) => api.post('/household/update-role', { memberId, role }),
};
