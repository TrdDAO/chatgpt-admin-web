const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
  addWebpackResolve,
  overrideDevServer,
} = require("customize-cra");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

process.env.CI = "false";
const addCustomize = () => (config, env) => {
  if (config.output.publicPath) {
    config.output.publicPath =
      process.env.NODE_ENV === "production"
        ? "/"
        : "/";
  }
  return config
};


module.exports = {
  webpack: override(
    // 针对antd实现按需打包: 根据import来打包(使用babel-plugin-import)
    fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: true, // 自动打包相关的样式
    }),
  
    // 使用less-loader对源码中的less的变量进行重新指定
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: { "@primary-color": "#1DA57A" },
    }),

    addWebpackResolve({
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.json']
    }),
  
    // 配置路径别名
    addWebpackAlias({
      "@": resolve("src"),
    }),
    addCustomize(),
  ),
  devServer: overrideDevServer((config) => {
    return {
      ...config,
      // hot: true,
      // port: 8000, // 设置开发服务器端口
      proxy: {
        '/api': {
          target: 'https://chat.miraclekang.com', // 'https://chatadm-dev.miraclekang.com' 'https://chat.miraclekang.com'
          changeOrigin: true,
        }
      }
    }
  })
}
