import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (error) {}
};

export const comparePassword = async (
  plainPassword: string,
  hashPass: string,
): Promise<boolean> => {
  try {
    return bcrypt.compareSync(plainPassword, hashPass);
  } catch (error) {}
};