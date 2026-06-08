import type { User } from "@prisma/client";

export const userResponseDto = (
  user: Pick<User, "id" | "userName" | "isAdmin">,
) => {
  return {
    id: user.id,
    userName: user.userName,
    isAdmin: user.isAdmin,
  };
};
