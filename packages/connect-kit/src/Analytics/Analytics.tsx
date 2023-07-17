/*import { getDebugLogger } from "../lib/logger";
const log = getDebugLogger('Analytics');

declare global {
  interface Window {
    analytics: any;
  }
}

class Analytics {
  analytics: any;
  data: any;
  user: string = ""; 

  constructor() {
    console.log("Analytics constructor")
    log("initialisation")
    const privateKey = "z89T2qEqEcSdxDWRmXHkpDEHCYbgZOpE"
    var analytics = (window.analytics = window.analytics || []);

    // Create a queue, but don't obliterate an existing one!

    // If the real analytics.js is already on the page return.
    if (this.analytics.initialize) return this.analytics;

    // If the snippet was invoked already show an error.
    if (analytics.invoked) {
      if (window.console && console.error) {
        console.error("Segment snippet included twice.");
      }
      return;
    }

    // Invoked flag, to make sure the snippet
    // is never invoked twice.
    analytics.invoked = true;

    // A list of the methods in Analytics.js to stub.
    analytics.methods = [
      "trackSubmit",
      "trackClick",
      "trackLink",
      "trackForm",
      "pageview",
      "identify",
      "reset",
      "group",
      "track",
      "ready",
      "alias",
      "debug",
      "page",
      "once",
      "off",
      "on",
      "addSourceMiddleware",
      "addIntegrationMiddleware",
      "setAnonymousId",
      "addDestinationMiddleware",
    ];

    // Define a factory to create stubs. These are placeholders
    // for methods in Analytics.js so that you never have to wait
    // for it to load to actually record data. The `method` is
    // stored as the first argument, so we can replay the data.
    analytics.factory = function (method: any) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(method);
        analytics.push(args);
        return analytics;
      };
    };

    // For each of our methods, generate a queueing stub.
    for (var i = 0; i < analytics.methods.length; i++) {
      var key = analytics.methods[i];
      analytics[key] = analytics.factory(key);
    }

    // Define a method to load Analytics.js from our CDN,
    // and that will be sure to only ever load it once.
    analytics.load = function (key: any, options: any) {
      // Create an async script element based on your key.
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src =
        "https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";

      // Insert our script next to the first script element.
      var first = document.getElementsByTagName("script")[0];
      first.parentNode?.insertBefore(script, first);
      analytics._loadOptions = options;
    };

    analytics._writeKey = privateKey;

    // Add a version to keep track of what's in the wild.
    analytics.SNIPPET_VERSION = "4.15.2";

    // Load Analytics.js with your key, which will automatically
    // load the tools you've enabled for your account. Boosh!
    analytics.load(privateKey);

    // Make the first page call to load the integrations. If
    // you'd like to manually name or tag the page, edit or
    // move this call however you'd like.
    this.analytics = analytics;
    console.log("Analytics constructor",  this.analytics)

    log("done with initialisation")

  }

  sendHostname() {
    log("send hostname")
    this.analytics.track("HostName", {
      host: window.location.hostname,
    });
  }

  sendAllData() {
    this.analytics.track("Data", {
      data: this.data,
    });
  }

  addData(key: string, value: any) {
    if (this.data.key) this.data.key += value;
    else this.data.key = value;
    console.log(this.data)
  }

  identify(id: string) {
    if (this.user) console.log(this.user);
    this.user = id;
   
  }
}

const analyticsInstance = new Analytics();

Object.freeze(analyticsInstance);

export default analyticsInstance;
*/