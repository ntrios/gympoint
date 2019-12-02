import Bee from 'bee-queue';
import redisConfig from '../config/redis';

import WelcomeMail from '../app/jobs/WelcomeMail';

const jobs = [WelcomeMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }
}

export default new Queue();
