var tweScript = document.createElement('script');
tweScript.type = 'text/javascript';
tweScript.src = '//twemoji.maxcdn.com/v/latest/twemoji.min.js';
tweScript.crossorigin = 'anonymous';
document.getElementsByTagName('body')[0].appendChild(tweScript);

var emojiStyle = document.createElement('style');
emojiStyle.type = 'text/css';
emojiStyle.innerHTML = 'img.emoji { margin: 0 0.3em; height: 1em; vertical-align: text-bottom; }';
document.getElementsByTagName('head')[0].appendChild(emojiStyle);

/* global twemoji */

var tweCountryFlags = {
	// IOC: [ ISO-3166-1 Alpha-3, ISO-3166-1 Alpha-2], // Country Name
	//     [       'AC'], //
	//     [       'CP'], //
	//     [       'DG'], //
	//     [       'EA'], //
	//     [       'EU'], //
	//     [       'IC'], //
	//     [       'TA'], //
	'AFG': ['AFG', 'AF'], // Afghanistan
	//     ['AIA', 'AI'], // Anguilla
	//     ['ALA', 'AX'], // Åland Islands
	'ALB': ['ALB', 'AL'], // Albania
	'ALG': ['DZA', 'DZ'], // Algeria
	'AND': ['AND', 'AD'], // Andorra
	'ANG': ['AGO', 'AO'], // Angola
	'ANT': ['ATG', 'AG'], // Antigua and Barbuda
	'ARG': ['ARG', 'AR'], // Argentina
	'ARM': ['ARM', 'AM'], // Armenia
	'ARU': ['ABW', 'AW'], // Aruba
	'ASA': ['ASM', 'AS'], // American Samoa
	//     ['ATA', 'AQ'], // Antarctica
	//     ['ATF', 'TF'], // French Southern Territories
	'AUS': ['AUS', 'AU'], // Australia
	'AUT': ['AUT', 'AT'], // Austria
	'AZE': ['AZE', 'AZ'], // Azerbaijan
	'BAH': ['BHS', 'BS'], // Bahamas
	'BAN': ['BGD', 'BD'], // Bangladesh
	'BAR': ['BRB', 'BB'], // Barbados
	'BDI': ['BDI', 'BI'], // Burundi
	'BEL': ['BEL', 'BE'], // Belgium
	'BEN': ['BEN', 'BJ'], // Benin
	'BER': ['BMU', 'BM'], // Bermuda
	//     ['BES', 'BQ'], // Bonaire, Saint Eustatius and Saba
	//     ['BHR', 'BH'], // Bahrain
	'BHU': ['BTN', 'BT'], // Bhutan
	'BIH': ['BIH', 'BA'], // Bosnia and Herzegovina
	'BIZ': ['BLM', 'BL'], // Saint Barthélemy
	'BLR': ['BLR', 'BY'], // Belarus
	//     ['BLZ', 'BZ'], // Belize
	'BOL': ['BOL', 'BO'], // Bolivia, Plurinational State of
	'BOT': ['BWA', 'BW'], // Botswana
	'BRA': ['BRA', 'BR'], // Brazil
	'BRN': ['BHR', 'BH'], // Bahrain
	'BRU': ['BRN', 'BN'], // Brunei Darussalam
	'BUL': ['BGR', 'BG'], // Bulgaria
	'BUR': ['BFA', 'BF'], // Burkina Faso
	//     ['BVT', 'BV'], // Bouvet Island
	'CAF': ['CAF', 'CF'], // Central African Republic
	'CAM': ['KHM', 'KH'], // Cambodia
	'CAN': ['CAN', 'CA'], // Canada
	'CAY': ['CYM', 'KY'], // Cayman Islands
	//     ['CCK', 'CC'], // Cocos (Keeling) Islands
	'CGO': ['COG', 'CG'], // Congo
	'CHA': ['TCD', 'TD'], // Chad
	'CHI': ['CHL', 'CL'], // Chile
	'CHN': ['CHN', 'CN'], // China
	'CIV': ['CIV', 'CI'], // Côte d'Ivoire
	'CMR': ['CMR', 'CM'], // Cameroon
	'COD': ['COD', 'CD'], // Congo, the Democratic Republic of the
	'COK': ['COK', 'CK'], // Cook Islands
	'COL': ['COL', 'CO'], // Colombia
	'COM': ['COM', 'KM'], // Comoros
	'CPV': ['CPV', 'CV'], // Cape Verde
	'CRC': ['CRI', 'CR'], // Costa Rica
	'CRO': ['HRV', 'HR'], // Croatia
	'CUB': ['CUB', 'CU'], // Cuba
	//     ['CUW', 'CW'], // Curaçao
	//     ['CXR', 'CX'], // Christmas Island
	'CYP': ['CYP', 'CY'], // Cyprus
	'CZE': ['CZE', 'CZ'], // Czech Republic
	'DEN': ['DNK', 'DK'], // Denmark
	'DJI': ['DJI', 'DJ'], // Djibouti
	'DMA': ['DMA', 'DM'], // Dominica
	'DOM': ['DOM', 'DO'], // Dominican Republic
	'ECU': ['ECU', 'EC'], // Ecuador
	'EGY': ['EGY', 'EG'], // Egypt
	'ERI': ['ERI', 'ER'], // Eritrea
	'ESA': ['SLV', 'SV'], // El Salvador
	//     ['ESH', 'EH'], // Western Sahara
	'ESP': ['ESP', 'ES'], // Spain
	'EST': ['EST', 'EE'], // Estonia
	'ETH': ['ETH', 'ET'], // Ethiopia
	'FIJ': ['FJI', 'FJ'], // Fiji
	'FIN': ['FIN', 'FI'], // Finland
	//     ['FLK', 'FK'], // Falkland Islands (Malvinas)
	'FRA': ['FRA', 'FR'], // France
	'FRO': ['FRO', 'FO'], // Faroe Islands
	'FSM': ['FSM', 'FM'], // Micronesia, Federated States of
	'GAB': ['GAB', 'GA'], // Gabon
	'GAM': ['GMB', 'GM'], // Gambia
	'GBR': ['GBR', 'GB'], // United Kingdom
	'GBS': ['GNB', 'GW'], // Guinea-Bissau
	'GEO': ['GEO', 'GE'], // Georgia
	'GEQ': ['GNQ', 'GQ'], // Equatorial Guinea
	'GER': ['DEU', 'DE'], // Germany
	//     ['GGY', 'GG'], // Guernsey
	'GHA': ['GHA', 'GH'], // Ghana
	//     ['GIB', 'GI'], // Gibraltar
	//     ['GLP', 'GP'], // Guadeloupe
	//     ['GNQ', 'GQ'], // Equatorial Guinea
	'GRE': ['GRC', 'GR'], // Greece
	//     ['GRL', 'GL'], // Greenland
	'GRN': ['GRD', 'GD'], // Grenada
	'GUA': ['GTM', 'GT'], // Guatemala
	//     ['GUF', 'GF'], // French Guiana
	'GUI': ['GIN', 'GN'], // Guinea
	'GUM': ['GUM', 'GU'], // Guam
	'GUY': ['GUY', 'GY'], // Guyana
	'HAI': ['HTI', 'HT'], // Haiti
	'HKG': ['HKG', 'HK'], // Hong Kong
	//     ['HMD', 'HM'], // Heard Island and McDonald Islands
	'HON': ['HND', 'HN'], // Honduras
	'HUN': ['HUN', 'HU'], // Hungary
	//     ['IMN', 'IM'], // Isle of Man
	'INA': ['IDN', 'ID'], // Indonesia
	'IND': ['IND', 'IN'], // India
	//     ['IOT', 'IO'], // British Indian Ocean Territory
	'IRI': ['IRN', 'IR'], // Iran, Islamic Republic of
	'IRL': ['IRL', 'IE'], // Ireland
	'IRQ': ['IRQ', 'IQ'], // Iraq
	'ISL': ['ISL', 'IS'], // Iceland
	'ISR': ['ISR', 'IL'], // Israel
	'ISV': ['VIR', 'VI'], // Virgin Islands, U.S.
	'ITA': ['ITA', 'IT'], // Italy
	'IVB': ['VGB', 'VG'], // Virgin Islands, British
	'JAM': ['JAM', 'JM'], // Jamaica
	//     ['JEY', 'JE'], // Jersey
	'JOR': ['JOR', 'JO'], // Jordan
	'JPN': ['JPN', 'JP'], // Japan
	'KAZ': ['KAZ', 'KZ'], // Kazakhstan
	'KEN': ['KEN', 'KE'], // Kenya
	'KGZ': ['KGZ', 'KG'], // Kyrgyzstan
	'KIR': ['KIR', 'KI'], // Kiribati
	'KOR': ['KOR', 'KR'], // Korea, Republic of
	'KOS': ['   ', 'XK'], // Kosovo
	'KSA': ['SAU', 'SA'], // Saudi Arabia
	'KUW': ['KWT', 'KW'], // Kuwait
	'LAO': ['LAO', 'LA'], // Lao People's Democratic Republic
	'LAT': ['LVA', 'LV'], // Latvia
	'LBA': ['LBY', 'LY'], // Libya
	'LBN': ['LBN', 'LB'], // Lebanon
	'LBR': ['LBR', 'LR'], // Liberia
	'LCA': ['LCA', 'LC'], // Saint Lucia
	'LES': ['LSO', 'LS'], // Lesotho
	'LIB': ['LBN', 'LB'], // Lebanon (until 2016)
	'LIE': ['LIE', 'LI'], // Liechtenstein
	'LTU': ['LTU', 'LT'], // Lithuania
	'LUX': ['LUX', 'LU'], // Luxembourg
	//     ['MAC', 'MO'], // Macao
	'MAD': ['MDG', 'MG'], // Madagascar
	//     ['MAF', 'MF'], // Saint Martin (French part)
	'MAR': ['MAR', 'MA'], // Morocco
	'MAS': ['MYS', 'MY'], // Malaysia
	'MAW': ['MWI', 'MW'], // Malawi
	'MDA': ['MDA', 'MD'], // Moldova, Republic of
	'MDV': ['MDV', 'MV'], // Maldives
	'MEX': ['MEX', 'MX'], // Mexico
	'MGL': ['MNG', 'MN'], // Mongolia
	'MHL': ['MHL', 'MH'], // Marshall Islands
	'MKD': ['MKD', 'MK'], // Macedonia, the former Yugoslav Republic of
	'MLI': ['MLI', 'ML'], // Mali
	'MLT': ['MLT', 'MT'], // Malta
	'MNE': ['MNE', 'ME'], // Montenegro
	//     ['MNP', 'MP'], // Northern Mariana Islands
	'MON': ['MCO', 'MC'], // Monaco
	'MOZ': ['MOZ', 'MZ'], // Mozambique
	'MRI': ['MUS', 'MU'], // Mauritius
	//     ['MSR', 'MS'], // Montserrat
	'MTN': ['MRT', 'MR'], // Mauritania
	//     ['MTQ', 'MQ'], // Martinique
	'MYA': ['MMR', 'MM'], // Myanmar
	//     ['MYT', 'YT'], // Mayotte
	'NAM': ['NAM', 'NA'], // Namibia
	'NCA': ['NIC', 'NI'], // Nicaragua
	//     ['NCL', 'NC'], // New Caledonia
	'NED': ['NLD', 'NL'], // Netherlands
	'NEP': ['NPL', 'NP'], // Nepal
	//     ['NFK', 'NF'], // Norfolk Island
	'NGR': ['NGA', 'NG'], // Nigeria
	'NIG': ['NER', 'NE'], // Niger
	//     ['NIU', 'NU'], // Niue
	'NOR': ['NOR', 'NO'], // Norway
	'NRU': ['NRU', 'NR'], // Nauru
	'NZL': ['NZL', 'NZ'], // New Zealand
	'OMA': ['OMN', 'OM'], // Oman
	'PAK': ['PAK', 'PK'], // Pakistan
	'PAN': ['PAN', 'PA'], // Panama
	'PAR': ['PRY', 'PY'], // Paraguay
	//     ['PCN', 'PN'], // Pitcairn
	'PER': ['PER', 'PE'], // Peru
	'PHI': ['PHL', 'PH'], // Philippines
	'PLE': ['PSE', 'PS'], // Palestinian Territory, Occupied
	'PLW': ['PLW', 'PW'], // Palau
	'PNG': ['PNG', 'PG'], // Papua New Guinea
	'POL': ['POL', 'PL'], // Poland
	'POR': ['PRT', 'PT'], // Portugal
	'PRK': ['PRK', 'KP'], // Korea, Democratic People's Republic of
	'PUR': ['PRI', 'PR'], // Puerto Rico
	//     ['PYF', 'PF'], // French Polynesia
	'QAT': ['QAT', 'QA'], // Qatar
	//     ['REU', 'RE'], // Réunion
	'ROU': ['ROU', 'RO'], // Romania
	'RSA': ['ZAF', 'ZA'], // South Africa
	'RUS': ['RUS', 'RU'], // Russian Federation
	'RWA': ['RWA', 'RW'], // Rwanda
	'SAM': ['WSM', 'WS'], // Samoa
	'SEN': ['SEN', 'SN'], // Senegal
	'SEY': ['SYC', 'SC'], // Seychelles
	'SGP': ['SGP', 'SG'], // Singapore
	//     ['SGS', 'GS'], // South Georgia and the South Sandwich Islands
	//     ['SHN', 'SH'], // Saint Helena, Ascension and Tristan da Cunha
	'SIN': ['SGP', 'SG'], // Singapore (until 2016)
	//     ['SJM', 'SJ'], // Svalbard and Jan Mayen
	'SKN': ['KNA', 'KN'], // Saint Kitts and Nevis
	'SLE': ['SLE', 'SL'], // Sierra Leone
	'SLO': ['SVN', 'SI'], // Slovenia
	'SMR': ['SMR', 'SM'], // San Marino
	'SOL': ['SLB', 'SB'], // Solomon Islands
	'SOM': ['SOM', 'SO'], // Somalia
	//     ['SPM', 'PM'], // Saint Pierre and Miquelon
	'SRB': ['SRB', 'RS'], // Serbia
	'SRI': ['LKA', 'LK'], // Sri Lanka
	'SSD': ['SSD', 'SS'], // South Sudan
	'STP': ['STP', 'ST'], // Sao Tome and Principe
	'SUD': ['SDN', 'SD'], // Sudan
	'SUI': ['CHE', 'CH'], // Switzerland
	'SUR': ['SUR', 'SR'], // Suriname
	'SVK': ['SVK', 'SK'], // Slovakia
	'SWE': ['SWE', 'SE'], // Sweden
	'SWZ': ['SWZ', 'SZ'], // Swaziland
	//     ['SXM', 'SX'], // Sint Maarten (Dutch part)
	'SYR': ['SYR', 'SY'], // Syrian Arab Republic
	'TAN': ['TZA', 'TZ'], // Tanzania, United Republic of
	//     ['TCA', 'TC'], // Turks and Caicos Islands
	'TGA': ['TON', 'TO'], // Tonga
	'THA': ['THA', 'TH'], // Thailand
	'TJK': ['TJK', 'TJ'], // Tajikistan
	//     ['TKL', 'TK'], // Tokelau
	'TKM': ['TKM', 'TM'], // Turkmenistan
	'TLS': ['TLS', 'TL'], // Timor-Leste
	'TOG': ['TGO', 'TG'], // Togo
	//     ['TWN', 'TW'], // Taiwan, Province of China
	'TTO': ['TTO', 'TT'], // Trinidad and Tobago
	'TUN': ['TUN', 'TN'], // Tunisia
	'TUR': ['TUR', 'TR'], // Turkey
	'TUV': ['TUV', 'TV'], // Tuvalu
	'UAE': ['ARE', 'AE'], // United Arab Emirates
	'UGA': ['UGA', 'UG'], // Uganda
	'UKR': ['UKR', 'UA'], // Ukraine
	//     ['UMI', 'UM'], // United States Minor Outlying Islands
	'URU': ['URY', 'UY'], // Uruguay
	'USA': ['USA', 'US'], // United States
	'UZB': ['UZB', 'UZ'], // Uzbekistan
	'VAN': ['VUT', 'VU'], // Vanuatu
	//     ['VAT', 'VA'], // Holy See (Vatican City State)
	'VEN': ['VEN', 'VE'], // Venezuela, Bolivarian Republic of
	'VIE': ['VNM', 'VN'], // Viet Nam
	'VIN': ['VCT', 'VC'], // Saint Vincent and the Grenadines
	//     ['WLF', 'WF'], // Wallis and Futuna
	'YEM': ['YEM', 'YE'], // Yemen
	'ZAM': ['ZMB', 'ZM'], // Zambia
	'ZIM': ['ZWE', 'ZW'], // Zimbabwe
};
var tweHashtag = {
	// ---- 団体 ----
	'ROT': 'Refugee_Olympic_Athletes',
	'REFUGEEOLYMPICTEAMS': 'Refugee_2',
	// ---- オリンピック/パラリンピック ----
	'PARALYMPICFLAME': 'Rio_Records',
	// ---- 開催国 ----
	'RIORECORDS': 'flame_paralympics_2016',
	'RIO2016': 'Paralympics_Rio2016___final',
	'リオ2016': 'Rio2016',
	'ROADTORIO': 'Rio2016',
	// ---- 夏季大会競技 ----
	'体操': 'ArtisticGymnastics',
	'陸上': 'Athletics',
	'ビーチバレー': 'BeachVolleyball',
	'CYCLINGBMX': 'CyclingBMX',
	'CYCLINGMOUNTAINBIKE': 'CyclingMountainBike',
	'自転車': 'CyclingTrack',
	'FOOTBALL5': 'Football_5_A_Side',
	'5人制サッカー': 'Football_5_A_Side',
	'FOOTBALL7': 'Football7_a_side_paralympics_2016',
	'7人制サッカー': 'Football7_a_side_paralympics_2016',
	'パワーリフティング': 'Powerlifting_paralympics_2016_v2',
	'RUGBYSEVENS': 'RugbySevens',
	'SHOOTINGSPORT': 'Shooting_Sport_v2',
	'SYNCHRONISEDSWIMMING': 'SynchronisedSwimming',
	'シンクロ': 'SynchronisedSwimming',
	'バレー': 'Volleyball',
	'車椅子バスケットボール': 'Wheelchair_Basketball_Fixed',
	// ---- 冬季大会競技 ----
	'ショートトラックスピードスケート': 'shorttrackski_WO_18',
	// ---- ポケットモンスター ----
	'DETECTIVEPIKACHU': 'WB_Pikachu_2018',
	'GOSNAPSHOT': 'PokemonGoJP_GoSnapshot_2019',
	// [#平成を語ろうハロー令和](https://blog.twitter.com/ja_jp/topics/events/2019/Hello_Reiwa.html)
	// [Twitterで平成を振り返ろう](https://blog.twitter.com/ja_jp/topics/events/2019/letstalkHeisei_2019.html)
	'新元号を考えてみた': 'NewEra_2019',
	'平成を語ろう': 'NewEra_2019',
	'平成最後': 'Heisei_2018_v2',
	'令和': 'Reiwa_NewEra_2019',
	'令和元年': 'Reiwa_NewEra_2019',
	'ハロー令和': 'Reiwa_NewEra_2019',
	// ---- 新海誠監督映画 ----
	'君の名は': 'YourNameMovie_2019',
	'YOURNAME': 'YourNameMovie_2019',
	'天気の子': 'Toho_Tenkinoko_2019',
	'WEATHERINGWITHYOU': 'Toho_Tenkinoko_2019',
	// ---- Amazon PrimeDay ----
	'AMAZON': 'AmazonPrimeDay_2019',
	'PRIMEDAYAMAZON': 'AmazonHotSale2019',
	// [#Twitterトレンド大賞 presents #Twitter夏祭り 開催が決定！](https://blog.twitter.com/ja_jp/topics/events/2019/twitter-trend-award-natsumatsuri-2019.html)
	'TWITTER夏祭り': 'SummerFestival_2020',
	'TWITTERトレンド大賞': 'TwitterTrendAward_2020',
	'TWITTERTRENDAWARD': 'TwitterTrendAward_2020',
	// ---- Rugby_World_Cup_2019_EMOJI_RWC2019 ----
	'GOLDBLOODED': 'Rugby_World_Cup_2019_Emojis_GoldBlooded_V2',
	'ONETEAM': 'OneTeam_2019_NewDesign',
	'RWCSAPPORO': 'Rugby_World_Cup_2019_EMOJI_RWCSapporo',
	'RWC札幌': 'Rugby_World_Cup_2019_EMOJI_RWCSapporo',
	'RWCKAMAISHI': 'Rugby_World_Cup_2019_EMOJI_Kamaishi',
	'RWC釜石': 'Rugby_World_Cup_2019_EMOJI_Kamaishi',
	'RWCKUMAGAYA': 'Rugby_World_Cup_2019_EMOJI_Kumagaya',
	'RWC熊谷': 'Rugby_World_Cup_2019_EMOJI_Kumagaya',
	'RWCTOKYO': 'Rugby_World_Cup_2019_EMOJI_Tokyo',
	'RWC東京': 'Rugby_World_Cup_2019_EMOJI_Tokyo',
	'RWCYOKOHAMA': 'Rugby_World_Cup_2019_EMOJI_Yokohama',
	'RWC横浜': 'Rugby_World_Cup_2019_EMOJI_Yokohama',
	'RWCSHIZUOKA': 'Rugby_World_Cup_2019_EMOJI_Shizuoka',
	'RWC静岡': 'Rugby_World_Cup_2019_EMOJI_Shizuoka',
	'RWCCITYOFTOYOTA': 'Rugby_World_Cup_2019_EMOJI_CityOfToyota',
	'RWC豊田': 'Rugby_World_Cup_2019_EMOJI_CityOfToyota',
	'RWCHANAZONO': 'Rugby_World_Cup_2019_EMOJI_Hanazono',
	'RWC花園': 'Rugby_World_Cup_2019_EMOJI_Hanazono',
	'RWCKOBE': 'Rugby_World_Cup_2019_EMOJI_Kobe_V2',
	'RWC神戸': 'Rugby_World_Cup_2019_EMOJI_Kobe_V2',
	'RWCFUKUOKA': 'Rugby_World_Cup_2019_EMOJI_Fukuoka',
	'RWC福岡': 'Rugby_World_Cup_2019_EMOJI_Fukuoka',
	'RWCKUMAMOTO': 'Rugby_World_Cup_2019_EMOJI_Kumamoto',
	'RWC熊本': 'Rugby_World_Cup_2019_EMOJI_Kumamoto',
	'RWCOITA': 'Rugby_World_Cup_2019_EMOJI_Oita',
	'RWC大分': 'Rugby_World_Cup_2019_EMOJI_Oita',
	'STARTSOMETHINGPRICELESS': 'StartSomethingPriceless_Rugby_World_Cup_Emoji',
	// https://twitter.com/NBAJPN/status/1188946041112014850
	'TRUETOATLANTA': 'NBATeam20192020Season_Emojis_ATL',
	'WEGOHARD': 'NBATeam20192020Season_Emojis_BKN',
	'CELTICS': 'NBATeam20192020Season_Emojis_BOS',
	'ALLFLY': 'NBATeam20192020Season_Emojis_CHA',
	'BULLSNATION': 'NBATeam20192020Season_Emojis_CHI',
	'BETHEFIGHT': 'NBATeam20192020Season_Emojis_CLE',
	'MFFL': 'NBATeam20192020Season_Emojis_DAL',
	'MILEHIGHBASKETBALL': 'NBATeam20192020Season_Emojis_DEN',
	'DETROITBASKETBALL': 'NBATeam20192020Season_Emojis_DET',
	'DUBNATION': 'NBATeam20192020Season_Emojis_GSW',
	'ONEMISSION': 'NBATeam20192020Season_Emojis_HOU',
	'INDIANASTYLE': 'NBATeam20192020Season_Emojis_IND',
	'CLIPPERNATION': 'NBATeam20192020Season_Emojis_LAC',
	'LAKESHOW': 'NBATeam20192020Season_Emojis_LAL',
	'GRINDCITY': 'NBATeam20192020Season_Emojis_MEM',
	'HEATTWITTER': 'NBATeam20192020Season_Emojis_MIA',
	'FEARTHEDEER': 'NBATeam20192020Season_Emojis_MIL',
	'TIMBERWOLVES': 'NBATeam20192020Season_Emojis_MIN',
	'WONTBOWDOWN': 'NBATeam20192020Season_Emojis_NOP',
	'NEWYORKFOREVER': 'NBATeam20192020Season_Emojis_NYK',
	'THUNDERUP': 'NBATeam20192020Season_Emojis_OKC',
	'MAGICABOVEALL': 'NBATeam20192020Season_Emojis_ORL',
	'PHILAUNITE': 'NBATeam20192020Season_Emojis_PHI',
	'RISEPHX': 'NBATeam20192020Season_Emojis_PHX_V2',
	'RIPCITY': 'NBATeam20192020Season_Emojis_POR',
	'SACRAMENTOPROUD': 'NBATeam20192020Season_Emojis_SAC',
	'GOSPURSGO': 'NBATeam20192020Season_Emojis_SAS',
	'WETHENORTH': 'NBATeam20192020Season_Emojis_TOR',
	'TAKENOTE': 'NBATeam20192020Season_Emojis_UTA',
	'REPTHEDISTRICT': 'NBATeam20192020Season_Emojis_WAS',
	'NBA': 'NBATeam20192020Season_Emojis_NBA',
	'NBATWITTER': 'NBATwitter_2018_RefreshEmoji',
	'NBATWITTERLIVE': 'NBATwitter_2018_RefreshEmoji',
	// https://twitter.com/TwitterJP/status/1190040138144833536
	'PREMIER12': 'WBSCPremier12TeamEmoji_V2',
	'プレミア12': 'WBSCPremier12TeamEmoji_V2',
	'프리미어12': 'WBSCPremier12TeamEmoji_V2',
	'世界12強': 'WBSCPremier12TeamEmoji_V2',
	'侍ジャパン': 'WBSCPremier12TeamEmoji_JAPAN',
	'AUSP12': 'WBSCPremier12TeamEmoji_Australia',
	'CANP12': 'WBSCPremier12TeamEmoji_CANADA',
	'CUBP12': 'WBSCPremier12TeamEmoji_CUBA',
	'DOMP12': 'WBSCPremier12TeamEmoji_DOMINICA',
	'KBO': 'WBSCPremier12TeamEmoji_KOREA',
	'NOVENAMÉXICO': 'WBSCPremier12TeamEmoji_Mexico',
	'TEAMKINGDOMNL': 'WBSCPremier12TeamEmoji_Netherlands_V2',
	'TODOSCONPR': 'WBSCPremier12TeamEmoji_PuertoRico',
	'相信中華': 'WBSCPremier12TeamEmoji_CHINESETAIPEI_V2',
	'FORGLORY': 'WBSCPremier12TeamEmoji_USA_V2',
	'PORTUSELECCIÓN': 'WBSCPremier12TeamEmoji_Venezuela',
	// [#全員団結 絵文字が出ます](https://blog.twitter.com/ja_jp/topics/company/2019/danketsu-olympic.html)
	'全員団結': 'JapanOlympicBrandTogether2020',
	'LAUSANNE2020': 'Lausanne_2020',
	// ---- 国際女性デー ----
	'IWD2020': 'IWD_2020',
	// ---- PlayStationPS5 ----
	'PLAYSTATION5': 'PlayStationPS5_2020',
	'PS5': 'PlayStationPS5_2020',
	'PS5REVEAL': 'PlayStationPS5_2020_add',
	// ---- https://twitter.com/TwitterJP/statuses/1289367947610267649 ----
	'HANABI': 'JP_FireworksDay_2020_BH',
	// ---- その他 ----
	'MYTWITTERANNIVERSARY': 'MyTwitterAnniversary',
	'LOVETWITTER': 'LoveTwitter',
	'METOO': 'MeToo_v3',
	'APPLEEVENT': 'MarchAppleEvent',
	'WWDC20': 'WWDC_2020_V11',
	'WWDC21': 'USEN_THB_TLB_72x72_BAN_WWDC_PREE_NA_NA_NA_NA_NA',
	'夏はサボテンダー': 'DFF_OperaOmnia_2019_Emoji',
	'ロマサガRS': 'romasaga_rs_2019',
	'シノアリス': 'Sinoalice_June2019',
	'GAMEOFTHRONES': 'GameofThrones_S8_2018_v2',
	'とと姉ちゃん': 'NHKMorningDrama',
	'高校野球': 'JapanHighSchoolBaseballEmoji',
	'KHL': 'KHL_Season_Start',
	'КХЛ': 'KHL_Season_Start'
};
var tweCategory = {
	'Google_IO_Q2_2022': [['GoogleIO', 'GoogleIO2022', 'GoogleIO22', 'IO2022', 'IO22']],
	'GoogleIO2021': [['GoogleIO2021', 'GoogleIO21', 'IO2021', 'IO21', 'Android12']],
	'Microsoft_Build_May_2022': [['MSBuild']],
	'MicrosoftBuild_2021': [['MSBUILD2021']],
	'Spring_High_School_Baseball_MBS_2022': [['選抜高校野球', 'みんなの甲子園', 'センバツ', 'センバツLIVE', '春はセンバツから']],
	'CatDay_white_2022': [
		[
			'Twitter猫の日アンバサダー',
			'にゃんにゃんにゃんの日',
			'ねこ',
			'ねこの日',
			'ネコ',
			'ネコの日',
			'猫',
			'猫のいる生活',
			'猫の日',
			'猫好きさんと繋がりたい'
		]
	],
	'Beijing_Paralympic_Agitos_2022': [['冬季パラリンピック', 'ParalympicGames', 'Paralympics']],
	'Beijing_Paralympic_xuerongrong_2022': [['ShueyRhonRhon', '雪容融']],
	'Beijing_Paralympic_ParaCurling_2022': [['WheelchairCurling', '車いすカーリング']],
	'Beijing_Paralympic_#_2022': [
		['Beijing2022', '北京2022'],
		['bingdwendwen', '冰墩墩'],
		['ClosingCeremony', '閉会式'],
		['Gold', '金メダル'],
		['OpeningCeremony', '開会式'],
		['ParaAlpine', 'パラアルパイン'],
		['ParaIceHockey', 'パラアイスホッケー'],
		['ParaNordic', 'パラノルディック'],
		['ParaSnowboard', 'パラスノーボード'],
		['bronze', '銅メダル'],
		['silver', '銀メダル']
	],
	'Beijing_Winter_#_2022': [
		['Olympics', 'OlympicGames', 'オリンピック']
	],
	'Beijing_Winter_Olympics_#_2022': [
		['AlpineSkiing', 'アルペンスキー'],
		['Biathlon', 'バイアスロン'],
		['Bobsleigh', 'ボブスレー'],
		['ClosingCeremony', '閉会式'],
		['CrossCountrySkiing', 'クロスカントリースキー'],
		['Curling', 'カーリング'],
		['FigureSkating', 'フィギュアスケート'],
		['FreestyleSkiing', 'Freestyle', 'SkiFreestyle', 'フリースタイルスキー'],
		['IceHockey', 'アイスホッケー'],
		['Luge', 'リュージュ'],
		['NordicCombined', 'ノルディック複合'],
		['ShortTrackSkating', 'ShortTrack', 'ショートトラック'],
		['Skeleton', 'スケルトン'],
		['SkiJumping', 'スキージャンプ'],
		['Snowboard', 'スノーボード'],
		['SpeedSkating', 'スピードスケート']
	],
	'Japan_Olympic_for_Beijing_2022_v2': [['teamjapan', 'チームジャパン']],
	'Olympics_2021_Sports_#': [
		['3x3'],
		['Archery', 'アーチェリー'],
		['ArtisticGymnastics', '体操競技'],
		['ArtisticSwimming', 'アーティスティックスイミング'],
		['Athletics', '陸上競技'],
		['Badminton', 'バドミントン'],
		['Baseball', '野球'],
		['Basketball', 'バスケットボール'],
		['BeachVolleyball', 'ビーチバレーボール'],
		['BMXFreestyle', 'BMXフリースタイル'],
		['BMXRacing', 'BMXレーシング'],
		['Boxing', 'ボクシング'],
		['CanoeSlalom', 'カヌースラローム'],
		['CanoeSprint', 'カヌースプリント'],
		['CyclingRoad', '自転車ロード'],
		['CyclingTrack', '自転車トラック'],
		['Diving', '飛込'],
		['Equestrian', '馬術'],
		['EquestrianDressage', '馬場馬術'],
		['EquestrianEventing', '総合馬術'],
		['Fencing', 'フェンシング'],
		['Football', 'サッカー'],
		['Golf', 'ゴルフ'],
		['Handball', 'ハンドボール'],
		['Hockey', 'ホッケー'],
		['Judo', '柔道'],
		['Karate', '空手', '空手組手'],
		['KarateKata', '空手形'],
		['MarathonSwimming', 'マラソンスイミング'],
		['ModernPentathlon', '近代五種'],
		['MountainBike', 'マウンテンバイク'],
		['RhythmicGymnastics', '新体操'],
		['Rowing', 'ボート'],
		['Rugby', 'ラグビー'],
		['Sailing', 'セーリング'],
		['Shooting', '射撃'],
		['Skateboarding', 'スケートボード'],
		['Softball', 'ソフトボール'],
		['SportClimbing', 'スポーツクライミング'],
		['Surfing', 'サーフィン'],
		['Swimming', 'アーティスティックスイミング'],
		['TableTennis', '卓球'],
		['Taekwondo', 'テコンドー'],
		['Tennis', 'テニス'],
		['TrampolineGymnastics', 'トランポリン'],
		['Triathlon', 'トライアスロン'],
		['Volleyball', 'バレーボール'],
		['WaterPolo', '水球'],
		['Weightlifting', 'ウエイトリフティング'],
		['Wrestling', 'レスリング'],
	],
	'Olympics_2021_Sports_Equestrian_add_v2': [['障害馬術']],
	'Olympics_Countries_2021_#': [['ROC'], ['MAC'], ['EOR']],
	'Olympics_Countries_2021_IRI_': [['IRI']],
	'Olympics_Countries_2021_BRA_add': [['TeamBrazil', 'TimeBrasil']],
	'TokyoOlympic_2021_Part1': [['みんなの聖火リレー', 'OLYMPICTORCHRELAY']],
	'Tokyo2020_Olympics_add': [['東京2020', 'TOKYO2020']],
	'Paris_2024_Olympics': [['JeuxOlympiques', 'paris2024', 'ParisHandover', 'SeeYouInParis','TokyoToParis']],
	'Paralympics_2021_add_': [['パラリンピック']],
	'Paralympics_2021_#': Object.keys(tweCountryFlags)
		.filter(function(key) {
			return !key.match(/^(AFG|AND|ANT|COM|KIR|LIB|LIE|PRK|RUS|SAM|SEY|SMR|SUD|SUR|VAN)$/);
		})
		.map(function(key) {
			return [key];
		})
		.concat([
			['AUT', 'ParalympicTeamAustria'],
			['BER', 'TeamBermuda'],
			['BHU', 'Bhutan', 'PaldenDrukpa'],
			['CHI', 'TEAMPARACHILETOKIO2020', 'TEAMPARACHILE'],
			['GBS', 'TeamGuineaBissau'],
			['GEO', 'TeamGEO', 'NPCGEO'],
			['HKG', 'HongKongTeam', '香港隊', 'TeamHongKong', '港隊'],
			['IRL', 'TeamIreland'],
			['ISV', 'USVI', 'USVIParaTeam', 'USVirginIslands'],
			['JPN', 'チームパラリンピックジャパン', 'ニッポン', '超えろみんなで', '日本'],
			['KOR', 'TeamKorea'],
			['LAT', 'TeamLAT', 'ParaTeamLAT'],
			['MDV', 'ParaTeamMaldives', 'ParalympiansMDV', 'ParalympicsMDV', 'TeamMaldives'],
			['NAM', 'TEAMBRAVE', 'NAMKOMESHO', 'TEAMNAM'],
			['NZL', 'OneTeamOneSpirit'],
			['PAR', 'TeamParaguay'],
			['POL', 'TeamPOL', 'PKPar', 'KibicujemyParaolimpijczykom'],
			['RPT', 'RefugeeParalympicTeam'],
			['SGP', 'SG', 'SIN', 'Singapore', 'TeamSingapore', 'TeamSG'],
			['SUI', 'Paralympicswissteam'],
			['TPE'],
			['TeamAfghanistan'],
			['USA', 'TeamUSA']
		]),
	'Paralympics_Sports_2021_#': [
		['Boccia', 'ParaBoccia', 'ボッチャ'],
		['CyclingRoad', 'パラサイクリングロード'],
		['CyclingTrack', 'ParaCycling', 'パラサイクリングトラック'],
		['Goalball', 'ゴールボール'],
		['ParaArchery', 'Archery', 'パラアーチェリー'],
		['ParaAthletics', 'Athletics', 'パラ陸上競技'],
		['ParaBadminton', 'Badminton', 'パラバドミントン'],
		['ParaCanoe', 'canoe', 'パラカヌー'],
		['ParaDressage', 'Equestrian', 'パラ馬術'],
		['ParaJudo', 'Judo', '視覚障害者柔道'],
		['ParaRowing', 'Rowing', 'パラローイング'],
		['ParaSwimming', 'Swimming', 'パラ水泳'],
		['ParaTableTennis', 'TableTennis', 'パラ卓球'],
		['ParaTaekwondo', 'Taekwondo', 'パラテコンドー'],
		['ParaTriathlon', 'Triathlon', 'パラトライアスロン'],
		['Powerlifting', 'パラパワーリフティング'],
		['ShootingParaSport', 'Shooting', 'パラ射撃'],
		['SittingVolleyball', 'Volleyball', 'シッティングバレーボール'],
		['WheelchairBasketball', 'Basketball', '車いすバスケットボール'],
		['WheelchairFencing', 'Fencing', '車いすフェンシング'],
		['WheelchairRugby', 'Rugby', '車いすラグビー'],
		['WheelchairTennis', 'Tennis', '車いすテニス '],
	],
	'Paralympics_Sports_2021_#_': [
		['BlindFootball', 'Football', '5人制サッカー'],
	],
	'#_wo_2018': [['COR'], ['oar']],
	'PyeongChang_WO_18': [['2018平昌', 'PYEONGCHANG2018']],
	'WBPikachu_#': [
		['Bulbasaur', 'フシギダネ', 'BULBIZARRE', 'BISASAM', '이상해씨', '妙蛙种子', '妙蛙種子', 'БУЛЬБАЗАВР'],
		['Charmander', 'ヒトカゲ', 'SALAMÈCHE', 'GLUMANDA', '파이리', '小火龙', '小火龍', 'ЧАРМАНДЕР'],
		['Mewtwo', 'ミュウツー', 'MEWTU', '뮤츠', '超梦', '超夢', 'МЬЮТУ']
	],
	'WBPikachu_#_v2': [['Squirtle', 'ゼニガメ', 'CARAPUCE', 'SCHIGGY', '꼬부기', '杰尼龟', '傑尼龜', 'СКВИРТЛ']],
	'Pokemon_Mew_2019_Emoji': [['ミュウ', 'ミュウツーの逆襲', 'ミュウツーの逆襲前夜祭', 'すべてはここからはじまった']],
	'PokemonCoCoMovieDec2020': [['ポケモン映画', 'ザルード', 'ポケットモンスターココ', '冬もポケモン', '父ちゃんだ']],
	'CherryBlossom_Sakura_2019': [
		// [3月27日は「#さくらの日」](https://blog.twitter.com/ja_jp/topics/events/2019/sakura_day2019.html)
		// https://twitter.com/TwitterJP/status/1110195453327335424
		['花見', 'はなみ', 'お花見', 'おはなみ', 'SAKURA', '開花宣言', '咲いた', 'サクラ', 'CHERRYBLOSSOM', '木之本桜']
	],
	'2020_CherryBlossom': [
		// [Twitter上でお花見気分を味わおう](https://blog.twitter.com/ja_jp/topics/events/2019/sakura_day2020.html)
		['さくらの日', '桜', 'さくら', '桜前線', '開花', '満開', 'サクラサク', '夜桜', '間桐桜', 'エア花見']
	],
	'CherryBlossom_2020_add': [['TLを花でいっぱいにしよう', 'TWITTERお花見2020', 'TWITTERお花見会', 'ツイッターお花見2020']],
	'WorldPenguinDay_2019': [
		// [4月25日は「#世界ペンギンの日」](https://blog.twitter.com/ja_jp/topics/events/2019/Worldpenguinday.html)
		['世界ペンギンの日', 'WORLDPENGUINDAY']
	],
	'ChildrensDay_2019': [
		// [「#こどもの日」と「#母の日」はTwitter上で家族へ感謝の気持ちや愛を伝えませんか？](https://blog.twitter.com/ja_jp/topics/events/2019/childrensday_mothersday.html)
		['こどもの日', '子どもの日', '親バカ部']
	],
	'MothersDay2020': [
		['母の日', 'うちの母のここがスゴイ', 'お母さんありがとう', 'MOTHERSDAY', 'HAPPYMOTHERSDAY', '어버이날']
	],
	'Fathers_Day_2020': [
		// [6月16日（日）「 #父の日 」にTwitterで #お父さんありがとう を伝えよう](https://blog.twitter.com/ja_jp/topics/events/2019/fathersday2019.html)
		['父の日', 'FATHERSDAY', 'お父さんありがとう', 'HAPPYFATHERSDAY'],
	],
	'Avengers_Endgame_2019': [
		['アベンジャーズ', 'AVENGERS', 'AVENGERSENDGAME', 'DONTSPOILTHEENDGAME', '0426逆襲へ', 'ありがとうアベンジャーズ'],
	],
	'Avengers_Endgame_2019_#': [
		['AntMan', 'アントマン'],
		['BlackPanther', 'ブラックパンサー'],
		['BlackWidow', 'ブラックウィドウ'],
		['CaptainAmerica', 'キャプテンアメリカ'],
		['CaptainMarvel', 'キャプテンマーベル'],
		['DoctorStrange', 'ドクターストレンジ'],
		['Drax', 'ドラックス'],
		['Gamora', 'ガモーラ'],
		['Groot', 'グルート'],
		['HappyHogan', 'ハッピーホーガン'],
		['Hawkeye', 'ホークアイ', 'RONIN'],
		['Hulk', 'ハルク'],
		['InfinityGauntlet', 'インフィニティガントレット', 'INFINITYSTONES', 'INFINITYSTONE'],
		['IronMan', 'アイアンマン'],
		['KevinFeige', 'MARVELSTUDIOS'],
		['Korg', 'コーグ'],
		['Loki', 'ロキ'],
		['Mbaku', 'エムバク'],
		['Mantis', 'マンティス'],
		['MariaHill', 'マリアヒル'],
		['Miek', 'ミーク'],
		['Nebula', 'ネビュラ'],
		['NickFury', 'ニックフューリー'],
		['Okoye', 'オコエ'],
		['PepperPotts', 'ペッパーポッツ'],
		['Rocket', 'ロケット'],
		['ScarletWitch', 'スカーレットウィッチ'],
		['Shuri', 'シュリ'],
		['Spiderman', 'スパイダーマン'],
		['Starlord', 'スターロード'],
		['Thanos', 'サノス'],
		['Valkyrie', 'ヴァルキリー'],
		['Thor', 'ソー'],
		['WarMachine', 'ウォーマシン'],
		['WinterSoldier', 'ウィンターソルジャー'],
		['Wong', 'ウォン'],
	],
	'Avengers_Endgame_2019_Falcon': [['THEFALCON', 'ファルコン']],
	'Avengers_Endgame_2019_RedSkull': [['THESTONEKEEPER']],
	'Avengers_Endgame_2019_Wasp': [['THEWASP', 'ワスプ']],
	'Disney_ToyStory4_#_v2': [['Woody', 'ウッディ', 'TOYSTORY', 'TOYSTORY4', 'トイストーリー4']],
	'Disney_ToyStory4_#': [
		['BoPeep', 'ボーピープ'],
		['Buzz', 'バズライトイヤー'],
		['DukeCaboom'],
		['Forky', 'フォーキー'],
	],
	'Disney_ToyStory4_ActualDuckyBunny': [['DUCKYBUNNY', 'DUCKYANDBUNNY', 'PLUSHRUSH']],
	'Disney_ToyStory4_DuckyBunny': [['GIGGLEMCDIMPLES']],
	'ToyStory4_Woody_Japan': [['いつまでも君はともだち', 'トイ4の夏がきた']],
	'AllStar_Baseball_Game_2019': [
		// [#夢のオールスター マイナビオールスターゲーム2019](https://blog.twitter.com/ja_jp/topics/events/2019/All-star-game.html)
		['マイナビオールスターゲーム2019', 'オールスター', '夢のオールスター', '球宴']
	],
	'PrimeDay_2020_JP': [['プライムデー', 'プライムデイ', 'プライムセール', 'アマゾン']],
	'Amazon_PrimeDay_2020_CA_Brasil': [['PRIMEDAY', 'PRIMEDAY2020', 'PRIMEDAY20', 'PRIMEDAYBRASIL', 'AMAZONPRIMEDAY']],
	'Disney_Aladdin_2019': [['ALADDIN', 'アラジン']],
	'Disney_Aladdin_#': [
		['Jasmine', 'ジャスミン', 'WHOLENEWWORLD', 'AWHOLENEWWORLD'],
		['Genie', 'ジーニー', 'FRIENDLIKEME'],
	],
	'Disney_Aladdin_Lamp': [['MAGICLAMP', '魔法のランプ', 'アラジンと新しい世界へ']],
	'G20Osaka_2019': [
		// https://twitter.com/TwitterGovJP/status/1135375663060344832
		[
			'G20',
			'G20SUMMIT',
			'G20JAPAN',
			'G20OSAKA',
			'G2019',
			'G20大阪',
			'G20大阪サミット',
			'G20サミット',
			'G20OSAKASUMMIT',
			'G20INOSAKA',
			'G20閣僚会合'
		],
	],
	'GoVoteUpperHouseElection_2019': [
		// [#参院選2019 Twitter上でニッポンの政治を知ろう、語ろう](https://blog.twitter.com/ja_jp/topics/company/2019/election_2019.html)
		['選挙', '参院選', '参院選2019', '令和初の参院選']
	],
	'2020_TokyoGubernatorialElection': [['東京都知事選挙', '東京都知事選', '都知事選', '選挙に行こう']],
	'Japan_Upper_House_Election_Jun_2022': [['私たちの選挙', '私たちの一票']],
	'WorldEmojiDay_2019': [
		// [7月17日は #世界絵文字デー](https://blog.twitter.com/ja_jp/topics/events/2019/World-Emoji-Day-2019.html)
		['WORLDEMOJIDAY', '世界絵文字デー', '鳥取', '鳥取県', '絵文字で鳥取県', 'おしどり', '絵文字', 'EMOJI']
	],
	'TwitterTrendAward_Summer_Emoji': [['ローソン屋台', '放置少女屋台', 'サマーウォーズ屋台']],
	'Disaster_Prevention_Day_2019_Emoji_GIF_V3': [
		// [#防災の日 もしもの際に備え、災害・防災に関する様々な取り組みを実施](https://blog.twitter.com/ja_jp/topics/events/2019/lifeline_2019.html)
		['防災の日', '防災', '防災豆知識', '非常時に知っておくと役立つ便利情報']
	],
	'Tokyo_Disaster_Prevention_Day_2019_Mascot_Emoji_GIF': [['東京防災', '防サイくん', '今やろう']],
	'311_for_2022_v2': [['防災いまできること', 'PRAYFORTOHOKU']],
	'311Tohokumemorial_2021_v3': [
		// https://twitter.com/TwitterJP/status/1366252059482202113
		[
			'あの日から10年',
			'あれから10年',
			'あれから私は',
			'これから私は',
			'東北ボランティア',
			'10YEARSLATER',
			'10ปีถัดมา',
			'10AÑOSDESPUÉS',
			'10ANSAPRÈS',
			'10JAHRESPÄTER',
			'10ÅRSENARE',
			'10ЛЕТСПУСТЯ',
			'10ΧΡΌΝΙΑΑΡΓΌΤΕΡΑ',
			'10YILSONRA',
			'10ANNIDOPO',
			'10JAARLATER',
			'LOVEFORTOHOKU'
		]
	],
	'WorldSuicidePreventionDay_2020': [
		[
			'WORLDSUICIDEPREVENTIONDAY',
			'世界自殺予防デー',
			'自殺予防週間',
			'相談してみよう',
			'弱音を吐こう',
			'WSPD',
			'WSPD2020',
			'SUICIDEPREVENTION',
			'10SEP',
			'LIGHTACANDLE',
		]
	],
	'Japan_Suicide_Prevention_Month_2022': [['自殺対策強化月間', '相談しよう', 'いのち支える']],
	'Rugby_World_Cup_2019_EMOJI_#': [
		['RWC2019'],
		['WebbEllisCup'],
		['JPNvRUS'],
		['NZLvRSA'],
		['ITAvNAM'],
		['IREvSCO'],
		['ENGvTGA'],
		['WALvGEO'],
		['RUSvSAM'],
		['FIGvURG'],
		['ITAvCAN'],
		['ENGvUSA'],
		['ARGvTGA'],
		['JPNvIRE'],
		['RSAvNAM'],
		['GEOvURU'],
		['AUSvWAL'],
		['SCOvSAM'],
		['FRAvUSA'],
		['NZLvCAN'],
		['GEOvFIJ'],
		['IREvRUS'],
		['RSAvITA'],
		['AUSvURU'],
		['ENGvARG'],
		['JPNvSAM'],
		['NZLvNAM'],
		['FRAvTGA'],
		['RSAvCAN'],
		['ARGvUSA'],
		['SCOvRUS'],
		['WALvFIJ'],
		['AUSvGEO'],
		['NZLvITA'],
		['ENGvFRA'],
		['IREvSAM'],
		['NAMvCAN'],
		['USAvTGA'],
		['WALvURU'],
		['JPNvSCO']
	],
	'Rugby_World_Cup_2019_EMOJI_#_V2': [['AUSvFIJ'], ['FRAvARG']],
	'Halloween_2020': [
		[
			'ハロウィン',
			'トリックオアトリート',
			'HALLOWEEN',
			'할로윈',
			'ハッピーハロウィン',
			'HAPPYHALLOWEEN',
			'해피할로윈',
			'HALLOWEEN2020',
			'할로윈2020',
			'HALLOWEEN20',
			'HAPPYHALLOWEEN2020',
			'HAPPYHALLOWEEN20',
		]
	],
	'Halloween2019_Emoji_GIF': [['HALLOWEEN19', 'HALLOWEEN2019']],
	'DogDay2019_Emoji_GIF': [['いぬの日', 'イヌの日', 'わんわんわんの日', 'うちの犬']],
	'EnthronementCeremony_Emoji_GIF': [
		// https://twitter.com/TwitterJP/status/1193353369672241152
		['即位の礼', '祝賀御列の儀', '即位礼正殿の儀', 'JAPANENTHRONEMENT', 'JPNENTHRONEMENT']
	],
	'Lunar_New_Year_2022_v2': [
		[
			'いーそーぐゎちでーびる',
			'ソーグヮチ',
			'そーぐゎち',
			'旧正月',
			'HappyNewYear',
			'LunarNewYear',
			'SpringFestival',
			'春節'
		]
	],
	'NewYearCelebration_Japan2020_sunrise': [
		// [年末年始はTwitterで 「#あけおめ」](https://blog.twitter.com/ja_jp/topics/events/2019/newyear-tweet-2019.html)
		['あけおめ', '謹賀新年', 'あけましておめでとう']
	],
	'NewYearCelebration_Japan2020_temple': [['初詣', '初詣で']],
	'NewYearCelebration_Japan2020_mtfuji': [['富士']],
	'NewYearCelebration_Japan2020_hawk': [['鷹']],
	'NewYearCelebration_Japan2020_eggplant': [['茄子', 'なすび', 'ナスビ']],
	'Meiji_THEChocolate_JP_2020': [['明治ザ・チョコレート', 'ザチョコレート', 'ザチョコ', 'レシート漫画']],
	'AsahiMitsuyaJapan_2020': [['3月28日は三ツ矢の日', '三ツ矢サイダー', '嵐と三ツ矢でカンパイ', '日本にはおいしいサイダーがある']],
	'AnimalCrossing_Nintendo_2020_NewArtwork_v2': [
		['あつまれどうぶつの森', 'どうぶつの森', 'ACNH', 'ANIMALCROSSING', 'ANIMALCROSSINGNEWHORIZONS']
	],
	'KIRINSoccerJapan_2020': [['キリチャレの日', '届けてキリン', '聖獣麒麟']],
	'Twitter_Women_Celebration_Month_March_2022': [['IWD2022']],
	'Twitter_Women_Celebration_Month_March_2022_add': [['WomensHistoryMonth', 'IWD', 'WHM']],
	'InternationalWomensDay2021': [
		[
			'国際女性デー',
			'INTERNATIONALWOMENSDAY',
			'IWD2021',
			'女性デー',
			'WOMENSDAY',
			'女性史月間',
			'WHM2021',
			'平等を目指す全ての世代',
			'GENERATIONEQUALITY',
			'WOMENSMARCHMY',
			'WOMENMARCHMY',
			'8M2021'
		]
	],
	'TwitterWomenTentpole_2021': [['私たちは女性', 'WEAREWOMEN']],
	'RootforSanrikuRailway_2020': [
		// [ツイートは誰かの応援になる Twitter JapanとYahoo! JAPANが三陸地方応援企画を実施](https://blog.twitter.com/ja_jp/topics/company/2019/311_sanriku.html)
		['がんばれ三鉄', '頑張れ三鉄', 'がんばれ三陸', '頑張れ三陸', '三鉄', '三陸鉄道', '三陸鉄道リアス線']
	],
	'WHO_SafeHands_2020': [['手洗い', '手洗いチャレンジ', 'HANDWASHING', 'SAFEHANDS', 'HANDWASHCHALLENGE', 'HANDWASHINGCHALLENGE']],
	'WashYourHands_2020_2021_ext2': [['手を洗おう', 'WASHYOURHANDS']],
	'StayHome_2020_2021_ext2': [['STAYHOME', 'HEALTHYATHOME', 'うちで過ごそう', 'ステイホーム']],
	'StayHome_2020': [['STAYATHOME', 'STAYATHOMESAVELIVES', 'STAYHOMECHALLENGE', '家で過ごそう', '家にいるだけで世界は救える']],
	'StayHome_2020_WorldHealthDay_add1': [['WORLDHEALTHDAY', '世界保健デー']],
	'TwitterForGood_2020': [['TWITTERFORGOOD', 'TWITTERFORGOODDAY', 'TFGDAY', 'TFG', 'FRIDAYFORGOOD']],
	'WorldEnvironmentDay_ForNature_2020': [['世界環境デー', 'WORLDENVIRONMENTDAY', 'FORNATURE']],
	'EnviornmentDay_JP_2021_v2': [['消えないで', '消えないでほしい', '消えないでほしいもの', '環境の日']],
	'EarthDay_2021_add': [
		['アースデー', 'EARTHDAY', 'EARTHDAY2021', 'EARTHRISE', 'CLIMATEACTION', 'VOTEEARTH', 'VOICEFORTHEPLANET', 'WORLDWITHOUTNATURE']
	],
	'EarthDay_2020_add2': [['EARTHDAY2020']],
	'WorldPressFreedomDay_2021': [
		[
			'世界報道自由デー',
			'報道の自由',
			'記者をフォローしよう',
			'ジャーナリストをフォローしよう',
			'WORLDPRESSFREEDOMDAY',
			'WPFD2021',
			'PRESSFREEDOM'
		]
	],
	'WorldPressFreedomDay_2020': [
		// https://twitter.com/TwitterJP/statuses/1256109065106669569
		['記者に感謝', 'THANKAJOURNALIST', 'WPFD2020']
	],
	'WMHD_2021': [['世界メンタルヘルスデー', 'メンタルヘルス', 'MOVEFORMENTALHEALTH', '話すのも悪くない']],
	'WMHD_2021_add_3': [['WorldMentalHealthDay', 'LetsTalk', 'MentalHealth', 'MentalHealthAwarenss', 'MentalHealthForAll', 'MentalHealthMatters', 'WMHD2021']],
	'MentalHealthMonth_2021_add2': [['一人で抱え込まないで', 'RECOVERTOGETHER', 'TOGETHERWECAN', 'WECARE']],
	'WorldMentalHealthDay_2020': [['WMHD2020']],
	'MentalHealthMonth_2021_add': [['MENTALHEALTHMONTH', 'MHM2021', 'GETREAL']],
	'BullyingPreventionMonth_2020': [
		[
			'いじめ防止',
			'BULLYINGPREVENTIONMONTH',
			'ANTIBULLYINGWEEK',
			'ANTIBULLYING',
			'UNITEDAGAINSTBULLYING',
			'HARDTOSEE',
			'STOPSPEAKSUPPORT',
			'BEANUPSTANDER',
			'CLICKWITHCOMPASSION',
			'CHOOSERESPECT',
			'BEKIND',
			'ODDSOCKSDAY'
		]
	],
	'SocialGoodPJ_ThankYouEveryone_2020': [['あたりまえにありがとう', 'わたしたちにできること']],
	'Houchishoujo_Q2_2020': [['放置少女', '放置少女3周年', 'LOVE放置少女']],
	'Houchishoujo_Q1_2020_V2': [['いつもあなたのそばに〜放置少女', '放置し過ぎないでね〜']], 'Thankful_Grateful_2020': [
		// https://twitter.com/TwitterJP/status/1260379335321518082
		[
			'ありがとう',
			'有り難う',
			'有難う',
			'ありがとうございます',
			'ありがと',
			'アリガト',
			'ありがたい',
			'有り難い',
			'有難い',
			'サンキュ',
			'さんきゅ',
			'感謝',
			'謝意',
			'THANKYOU',
			'THANKS',
			'THX',
			'THANKFUL'
		]
	],
	'Pride_2020': [
		[
			'東京レインボープライド',
			'TRP2020',
			'好きだから好き',
			'PRIDE',
			'PRIDE2020',
			'GLOBALPRIDE',
			'GLOBALPRIDE2020',
			'LOVEISLOVE'
		]
	],
	'Pride_2020_AlwaysProud': [['常に誇りを', 'ALWAYSPROUD', 'PRIDEMONTH']],
	'LGBT_History_Month_UK_2022': [[ 'LGBTHistoryMonth', 'LGBTHM2022', 'LGBTHM22', 'LGBTQIAHistoryMonth', 'LGBTQIAHM2022' ]],
	'LGBTQHistoryMonth_2021': [
		[
			'LGBTQIAHM2021',
			'LGBTQIAHM21',
			'LGBTQIHISTORYMONTH',
			'LGBTQHISTORYMONTH',
			'LGBTQHM2021',
			'LGBTHM2021',
			'LGBTHM21'
		]
	],
	'LGBTHistoryMonth_2020': [['LGBTQIAHM2020', 'LGBTQIAHM20', 'LGBTQHM2020', 'LGBTHM2020', 'LGBTHM20']],
	'NationalComingOutDay_2020': [
		['COMINGOUTDAY', 'COMINGOUTDAY2020', 'NATIONALCOMINGOUTDAY', 'NATIONALCOMINGOUTDAY2020', 'COMINGOUT', 'MYCOMINGOUTSTORY']
	],
	'MyImmigrantStory_2020': [['海外移住ストーリー', '国外移住ストーリー', 'MYIMMIGRANTSTORY']],
	'WorldRefugees2020': [['世界難民の日', 'WORLDREFUGEEDAY', 'REFUGEEDAY', 'WITHREFUGEES']],
	'FireworksRelayJP_April_2021': [['花火', '花火大会', '花火打ち上げ', '花火の音', '花火どこ', '花火駅伝']],
	'WearAMask_2020_2021_ext4': [['マスクをしよう', 'WEARAMASK']],
	'BlackHistoryMonthUK_BHMUK_2020': [['BLACKHISTORYMONTHUK', 'BHMUK']],
	'DayOfTheGirl_2021': [['国際ガールズデー', 'DAYOFTHEGIRL']],
	'Christmas_2020': [['クリスマス', 'CHRISTMAS', 'ハッピークリスマス', 'HAPPYCHRISTMAS', 'メリークリスマス', 'MERRYCHRISTMAS']],
	'HumanRightsDay_2020': [['世界人権デー', '人権デー', '人権', 'HUMANRIGHTSDAY', 'HUMANRIGHTS', 'STANDUP4HUMANRIGHTS']],
	'SpaceSunrise_2020': [
		// [Twitter上で #宇宙の初日の出 を迎えましょう](https://blog.twitter.com/ja_jp/topics/events/2020/twitter_space_sunrise_2021.html)
		['KIBO', '宇宙からあけおめ', '宇宙の初日の出', 'スペースサンライズ', 'SPACESUNRISE']
	],
	'SaferInternetDay_2021': [['セーファーインターネットデー', 'SAFERINTERNETDAY', 'SID2021']],
	'WorldRedCrossDay_May_2021': [['世界赤十字デー', 'REDCROSS', 'REDCRESCENTDAY', 'REDCROSSDAY', 'WORLDREDCRESCENTDAY', 'WORLDREDCROSSDAY']],
	'WorldRedCrossDay_May_2021_add2': [['REDCRESCENT']],
	'WorldImmunizationWeek_April_2021': [
		[
			'世界予防接種週間',
			'世界予防接種週間2021',
			'ワクチン効果あり',
			'VACCINESWORK',
			'WORLDIMMUNISATIONWEEK',
			'WORLDIMMUNIZATIONWEEK',
			'WORLDIMMUNIZATIONWEEK2021'
		]
	],
	'Vaccinated_Japan_2022': [['ワクチン完了']],
	'NvidiaGTCFall2021': [['GTC2021', 'NVIDIAGTC', 'GTCVisionary', 'NVIDIA']],
	'COP26_2021': [['COP26', 'RaceToResilience', 'RaceToZero', 'TogetherForOurPlanet']],
	'PikminBloom_2021': [['ピクミン', 'ピクミンブルーム', 'Pikmin', 'PikminBloom']],
	'KIRIN_Gogo_Tea_Japan_Feb_2022': [['午後の紅茶', '午後ティー', '幸せの紅茶']],
	'#': [
		// [Twitter上で2020年を共に過ごした皆さんへ](https://blog.twitter.com/ja_jp/topics/company/2020/thishappened-in-2020-ja.html)
		['ThisHappened2020', '今年のできごと2020', 'THISHAPPENED'],
		['BlackHistoryMonth', 'BLACKLIVESMATTER', 'BHM']
	]
};
Object.keys(tweCategory).forEach(function(key) {
	tweCategory[key].forEach(function(names) {
		names.forEach(function(name) {
			tweHashtag[name.toUpperCase()] = key.replace('#', names[0]);
		});
	});
});

function tweReplaceEmoji(el) {
	Array.prototype.forEach.call(el.querySelectorAll('.status > .hashtag, .udesc > .hashtag'), function(elHashtag) {
		var index = elHashtag.innerHTML.replace(/^[#＃]/, '').toUpperCase();
		if (tweHashtag[index]) {
			elHashtag.innerHTML += makeHTMLFromIconName(tweHashtag[index]);
		} else if (tweCountryFlags[index]) {
			elHashtag.innerHTML += makeHTMLFromAlpha2(tweCountryFlags[index][1]);
		}
	});
	Array.prototype.forEach.call(el.querySelectorAll('.uname, .status, #profile > div'), function(unparse) {
		twemoji.parse(unparse, { folder: 'svg', ext: '.svg' });
	});

	function makeHTMLFromAlpha2(alpha2) {
		if (!alpha2.match(/^[A-Z]{2}$/)) return alpha2;
		return alpha2.split('').map(function(s) {
			return twemoji.convert.fromCodePoint(s.charCodeAt(0) + 0x1f1a5);
		}).join('');
	}

	function makeHTMLFromIconName(iconName) {
		iconName = (function(name) {
			var pattern = /\[(\d+)-(\d+)\]/;
			var range = name.match(pattern);
			return range ? name.replace(pattern, (function(min, max) {
				var l = parseInt(min, 10), h = parseInt(max, 10);
				return parseInt(l + Math.random() * (h + 1 - l), 10);
			})(range[1], range[2])) : name;
		})(iconName);
		return [
			'<img class="emoji" draggable="false" alt="" src="//abs.twimg.com/hashflags/',
			iconName,
			'/',
			iconName,
			'.png">'
		].join('');
	}
}

registerPlugin({
	newMessageElement: function(el) {
		tweReplaceEmoji(el);
	},
	newUserInfoElement: function() {
		tweReplaceEmoji($('profile'));
	}
});
