class ChannelService {
  constructor() {
    this.loadScript()
  }

  loadScript() {
    var w = window
    if (w.ChannelIO) {
      return (window.console.error || window.console.log || function () {})(
        'ChannelIO script included twice.'
      )
    }
    var ch: any = function () {
      ch.c(arguments)
    }
    ch.q = []
    ch.c = function (args: any) {
      ch.q.push(args)
    }
    w.ChannelIO = ch
    function l() {
      if (w.ChannelIOInitialized) {
        return
      }
      w.ChannelIOInitialized = true
      var s: any = document.createElement('script')
      s.type = 'text/javascript'
      s.async = true
      s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js'
      s.charset = 'UTF-8'
      var x: any = document.getElementsByTagName('script')[0]
      x.parentNode.insertBefore(s, x)
    }
    if (document.readyState === 'complete') {
      l()
    } else if (window.attachEvent) {
      window.attachEvent('onload', l)
    } else {
      window.addEventListener('DOMContentLoaded', l, false)
      window.addEventListener('load', l, false)
    }
  }

  boot(settings: any) {
    window.ChannelIO('boot', settings)
  }

  shutdown() {
    window.ChannelIO('shutdown')
  }
}

export default new ChannelService()
