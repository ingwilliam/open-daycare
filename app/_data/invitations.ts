// Invitation sent by the daycare to a parent. Mock data until the backend exists.
export interface Invitation {
  code: string; // "7K4P9"
  kidId: string; // "mateo-fernandez" → resuelto con getKidById() de app/_data/kids.ts
  parentEmail: string; // "lucia.fernandez@gmail.com"
}

export const mockInvitation: Invitation = {
  code: '7K4P9',
  kidId: 'mateo-fernandez',
  parentEmail: 'lucia.fernandez@gmail.com',
};
