#!/usr/bin/ruby

require 'open-uri'
require 'rss/1.0'
require 'rss/dublincore'

print 'favEntries({'

fav_url = "http://favotter.matope.com/home.php?page="
(1..10).each {|page|
  favc = open(fav_url+page.to_s) {|f|
    id = 0
    f.readlines().each {|x|
      if x.match(/posted at <a class="taggedlink" href="status.php\?id=(\d+)">/)
        id = $1
      end
      if x.match(/(\d+) fav by/)
        nfav = $1
        print "\"#{id}\":#{nfav},"
      end
    }
  }
}

print "});\n";
