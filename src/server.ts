import app from "./app";
import config from "./config/config";

function bootstrap() {
  app.listen(config.port, () => {
    console.log("Server is running on port 8000");
  });
}

bootstrap();
