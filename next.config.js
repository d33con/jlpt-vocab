const { withSuperjson } = require("next-superjson");

module.exports = withSuperjson()({});

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};
