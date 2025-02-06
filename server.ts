import cluster from "cluster";
import os from "os";
import app from "./src";

const PORT = process.env.PORT || 3000;

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`primary process is running. forking for ${numCPUs} `);

  for (let i = 0; i < numCPUs; i++) cluster.fork();

  cluster.on("exit", (worker) => {
    console.log(`worker ${worker.process.pid} stopped. restarting...`);
    cluster.fork();
  });
} else
  app.listen(PORT, () =>
    console.log(
      `worker ${process.pid} Connected , server running on http://localhost:${PORT}`
    )
  );
