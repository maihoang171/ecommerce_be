import type { User } from "@prisma/client";

export const userResponseDto = (
  user: Pick<User, "id" | "username" | "isAdmin">,
) => {
  return {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
  };
};
