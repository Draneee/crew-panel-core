export const USER_BLOCK: {
  [key: string]: { layout: { dashboard: boolean; courier: boolean } };
} = {
  'invitado@crew.co': {
    layout: {
      dashboard: true,
      courier: false,
    },
  },
};

export const USER_SOURCE: Record<string, number> = {
  'invitado@crew.co': 0,
};
