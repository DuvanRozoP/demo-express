type TGetMethod = {
  [url: string]: (req: TRequestFts) => Promise<Response> | Response;
};

type TPostMethod = {
  [url: string]: (req: TRequestFts) => Promise<Response> | Response;
};

// tipado de response y request
export type TRequestFts = {
  baseUrl: string; // url de la peticion
  method: string; // metodo de la peticion
  params: {
    [x: string]: any;
  };
};

class Fts {
  private getMethod: TGetMethod = {};
  private postMethod: TPostMethod = {};
  // private requestFts: TRequestFts = {};
  constructor() {}

  public get(
    url: string,
    callback: (req: TRequestFts) => Promise<Response> | Response
  ) {
    this.getMethod[url] = async (req: TRequestFts) => {
      try {
        return await callback(req);
      } catch (error) {
        return new Response('Error en la solicitud', { status: 500 });
      }
    };
  }
  public post(
    url: string,
    callback: (req: TRequestFts) => Promise<Response> | Response
  ) {
    this.postMethod[url] = async (req: TRequestFts) => {
      try {
        return await callback(req);
      } catch (error) {
        return new Response('Error en la solicitud', { status: 500 });
      }
    };
  }

  public listen(port: number, callback: () => void) {
    const self = this;
    Bun.serve({
      port,
      async fetch(this, req: Request) {
        const url = new URL(req.url);
        const request: TRequestFts = {
          baseUrl: url.pathname, // url de la peticion
          method: req.method, // metodo de la peticion
          params: Object.fromEntries(url.searchParams.entries()),
        };

        switch (req.method) {
          case 'GET':
            if (self.getMethod[url.pathname])
              return self.getMethod[url.pathname](request);
            else return self.getMethod['*'](request);
            break;
          case 'POST':
            console.log('🚀 ~ file: express.ts:54 ~ Fts ~ fetch ~ req:', req);
            console.log(
              '🚀 ~ file: express.ts:70 ~ Fts ~ fetch ~ req.body:',
              req.on()
            );
            return new Response('method post ready!');
          default:
            return new Response(`method no exist ${req.method}`);
            break;
        }
      },
    });
    callback();
  }
}

export default Fts;
