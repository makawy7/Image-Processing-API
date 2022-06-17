import Request from 'request';
import server from '../index';
import { promises as fsPromises } from 'fs';
import path from 'path';

const imagesPath = path.resolve(`./assets/images/`);
const files: string[] = [];

describe('Server', () => {
  afterAll(() => {
    server.close();
  });

  // delete all previously resized images before running the test
  beforeAll(() => {
    fsPromises.readdir(imagesPath).then((filenames) => {
      for (const filename of filenames) {
        files.push(filename);
      }
      remove(files);
    });

    function remove(files: string[]): void {
      files.forEach(function (filename) {
        if (filename.includes('_thumb')) {
          fsPromises.unlink(`${imagesPath}/${filename}`);
        }
      });
    }
  });

  describe('Server status', () => {
    let status = 0;
    beforeEach((done) => {
      Request.get('http://localhost:3000/', (error, response) => {
        status = response.statusCode;
        done();
      });
    });
    it('server is working, and returns status code 200', () => {
      expect(status).toBe(200);
    });
  });

  describe('URL validation', () => {
    let parametersStatus = 0;
    let dimensionCheck = 0;
    let existStatus = 0;
    beforeEach((done) => {
      Request.get(
        'http://localhost:3000/api/img?filename=&width=&height=',
        (error, response) => {
          parametersStatus = response.statusCode;
          done();
        }
      );
    });

    it("/api/img doesn't accept any empty parameter [filename, width, height]", () => {
      expect(parametersStatus).toBe(404);
    });

    beforeEach((done) => {
      Request.get(
        'http://localhost:3000/api/img?filename=any&width=200&height=5',
        (error, response) => {
          dimensionCheck = response.statusCode;
          done();
        }
      );
    });

    it('Width or height must be at least 10x10px', () => {
      expect(dimensionCheck).toBe(404);
    });

    beforeEach((done) => {
      Request.get(
        'http://localhost:3000/api/img?filename=notfound&width=200&height=200',
        (error, response) => {
          existStatus = response.statusCode;
          done();
        }
      );
    });

    it('filename has to be of an existent image inside assets folder', () => {
      expect(existStatus).toBe(404);
    });
  });

  describe('Image Processing', () => {
    let processStatus = 0;

    beforeEach((done) => {
      Request.get(
        'http://localhost:3000/api/img?filename=encenadaport&width=200&height=200',
        (error, response) => {
          processStatus = response.statusCode;
          done();
        }
      );
    });

    it("resize the image of it was't previously resized to the same width and height", () => {
      expect(processStatus).toBe(201);
    });
  });
});
