const keys = require("lodash/keys");
const regedit = require("regedit");

const browsers = {
  chrome: "ChromeHTML",
  firefox: "FirefoxURL",
  ie: "IE.HTTP"
};

module.exports = function(vorpal) {
  vorpal
    .command("default-browser <browser>")
    .alias("db")
    .autocomplete(keys(browsers))
    .description("Change the default browser")
    .action(function(args, callback) {
      const browserRegistryValue = browsers[args.browser] || args.browser;

      const valuesToPut = {
        "HKCU\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice": {
          Progid: {
            value: browserRegistryValue,
            type: "REG_SZ"
          }
        },
        "HKCU\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\https\\UserChoice": {
          Progid: {
            value: browserRegistryValue,
            type: "REG_SZ"
          }
        }
      };

      const editRegistry = () => {
        regedit.putValue(valuesToPut, err => {
          if (err) {
            this.log("ERROR", err);
          } else {
            this.log("Default browser changed!");
          }
        });
      };

      editRegistry();
      callback();
    });
};
