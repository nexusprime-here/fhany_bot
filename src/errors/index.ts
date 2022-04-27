import logger from "../utils/logger";

export type MyError = (envVar: string) => ReturnType<typeof logger["error"]>;

export default <{ [key: string]: MyError }> {
  envNotFound: (envVar) => {
    logger.error(`Env var ${envVar} not found, process exited.`);
    process.exit(0);
  },
}