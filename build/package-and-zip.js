const { exec } = require("child_process");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

exec(
  "npx electron-packager . ChatGPT --platform=win32 --arch=x64 --out=build/dist --overwrite",
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during packaging: ${error.message}`);
      return;
    }

    // 打包完成，创建ZIP
    const output = fs.createWriteStream(
      path.join(__dirname, "dist", "ChatGPT-win32-x64.zip"),
    );
    const archive = archiver("zip", {
      zlib: { level: 9 }, // 设置压缩级别
    });

    output.on("close", () => {
      console.log(`Packaging complete. ${archive.pointer()} total bytes`);
    });

    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(output);

    // 将打包好的应用目录添加到ZIP包中
    archive.directory("dist/ChatGPT-win32-x64/", false);

    // 完成压缩
    archive.finalize();
  },
);
