import logger from "pino";
import dayjs from "dayjs";

const log = logger({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "yyyy-mm-dd HH:MM:ss.l",
      ignore: "pid,hostname",
    },
  },
  base: {
    pid: false,
  },
  timestamp: () => `, "time":"${dayjs().format()}"`,
});

export default log;
