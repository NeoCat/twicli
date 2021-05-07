// [Follow the Rio 2016 @Olympics on Twitter, Vine, and Periscope | Twitter Blogs](https://blog.twitter.com/2016/follow-the-rio-2016-olympics-on-twitter-vine-and-periscope)
// [Twitter、Vine、Periscopeで #オリンピック をより楽しみましょう | Twitter Blogs](https://blog.twitter.com/ja/2016/rio0802)
// [Join the #Paralympics conversation on Twitter | Twitter Blogs](https://blog.twitter.com/2016/join-the-paralympics-conversation-on-twitter)
// [Follow the 2018 Winter @Olympics on Twitter](https://blog.twitter.com/official/en_us/topics/events/2018/Follow-the-2018-Winter-Olympics-on-Twitter.html)
// [冬季 #オリンピック](https://blog.twitter.com/official/ja_jp/topics/events/2018/0209_sports.html)

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

function tweReplaceEmoji(el) {
	// IOC: [ ISO-3166-1 Alpha-3, ISO-3166-1 Alpha-2], // Country Name
	var countryFlags = {
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
		//     ['FRO', 'FO'], // Faroe Islands
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
		'LBR': ['LBR', 'LR'], // Liberia
		'LCA': ['LCA', 'LC'], // Saint Lucia
		'LES': ['LSO', 'LS'], // Lesotho
		'LIB': ['LBN', 'LB'], // Lebanon
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
		//     ['SGS', 'GS'], // South Georgia and the South Sandwich Islands
		//     ['SHN', 'SH'], // Saint Helena, Ascension and Tristan da Cunha
		'SIN': ['SGP', 'SG'], // Singapore
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
		// ---- other ----
		'GOLD': ['', '\uD83E\uDD47'], // First Place Medal
		'金メダル': ['', '\uD83E\uDD47'], // First Place Medal
		'SILVER': ['', '\uD83E\uDD48'], // Second Place Medal
		'銀メダル': ['', '\uD83E\uDD48'], // Second Place Medal
		'BRONZE': ['', '\uD83E\uDD49'], // Third Place Medal
		'銅メダル': ['', '\uD83E\uDD49'] // Third Place Medal
	};

	var organization = {
		// ---- 団体 ----
		'TPE': 'Taipei',
		'ROT': 'Refugee_Olympic_Athletes',
		'REFUGEEOLYMPICTEAMS': 'Refugee_2',
		'COR': 'COR_wo_2018',
		'OAR': 'oar_wo_2018', // Olympic Athletes from Russia
		// ---- オリンピック/パラリンピック ----
		'OLYMPICGAMES': 'Olympics',
		'OLYMPICS': 'olympics_WO_18_v2',
		'オリンピック': 'olympics_WO_18_v2',
		'PARALYMPICS': 'Logo_paralympics_2016_v5',
		'パラリンピック': 'Logo_paralympics_2016_v5',
		'PARALYMPICFLAME': 'Rio_Records',
		'みんなの聖火リレー': 'TokyoOlympic_2021_Part1',
		'OLYMPICTORCHRELAY': 'TokyoOlympic_2021_Part1',
		// ---- 開催国 ----
		'RIORECORDS': 'flame_paralympics_2016',
		'RIO2016': 'Paralympics_Rio2016___final',
		'リオ2016': 'Rio2016',
		'ROADTORIO': 'Rio2016',
		'2018平昌': 'PyeongChang_WO_18',
		'PYEONGCHANG2018': 'PyeongChang_WO_18',
		'東京2020':'Tokyo2020_Olympics_add',
		'TOKYO2020':'Tokyo2020_Olympics_add',
		// ---- 式典 ----
		'OPENINGCEREMONY': 'openingceremony_WO_18_v2',
		'開会式': 'openingceremony_WO_18_v2',
		'CLOSINGCEREMONY': 'closingceremony_WO_18',
		'閉会式': 'closingceremony_WO_18',
		// ---- 夏季大会競技 ----
		'ARCHERY': 'Archery',
		'アーチェリー': 'Archery',
		'ARTISTICGYMNASTICS': 'ArtisticGymnastics',
		'体操': 'ArtisticGymnastics',
		'ATHLETICS': 'Athletics',
		'陸上': 'Athletics',
		'BADMINTON': 'Badminton',
		'バドミントン': 'Badminton',
		'BASKETBALL': 'Basketball',
		'バスケットボール': 'Basketball',
		'BEACHVOLLEYBALL': 'BeachVolleyball',
		'ビーチバレー': 'BeachVolleyball',
		'BOCCIA': 'Boccia',
		'ボッチャ': 'Boccia',
		'BOXING': 'Boxing',
		'ボクシング': 'Boxing',
		'CANOESLALOM': 'CanoeSlalom',
		'カヌースラローム': 'CanoeSlalom',
		'CANOESPRINT': 'CanoeSprint',
		'カヌースプリント': 'CanoeSprint',
		'CYCLINGBMX': 'CyclingBMX',
		'CYCLINGMOUNTAINBIKE': 'CyclingMountainBike',
		'CYCLINGROAD': 'CyclingRoad',
		'CYCLINGTRACK': 'CyclingTrack',
		'自転車': 'CyclingTrack',
		'DIVING': 'Diving',
		'EQUESTRIAN': 'Equestrian',
		'馬術': 'Equestrian',
		'FENCING': 'Fencing',
		'フェンシング': 'Fencing',
		'FOOTBALL': 'Football',
		'FOOTBALL5': 'Football_5_A_Side',
		'5人制サッカー': 'Football_5_A_Side',
		'FOOTBALL7': 'Football7_a_side_paralympics_2016',
		'7人制サッカー': 'Football7_a_side_paralympics_2016',
		'GOALBALL': 'Goalball_v2',
		'ゴールボール': 'Goalball_v2',
		'GOLF': 'Golf',
		'ゴルフ': 'Golf',
		'HANDBALL': 'Handball',
		'ハンドボール': 'Handball',
		'HOCKEY': 'Hockey',
		'ホッケー': 'Hockey',
		'JUDO': 'Judo',
		'柔道': 'Judo',
		'MARATHONSWIMMING': 'MarathonSwimming',
		'マラソンスイミング': 'MarathonSwimming',
		'MODERNPENTATHLON': 'ModernPentathlon',
		'近代五種': 'ModernPentathlon',
		'POWERLIFTING': 'Powerlifting_paralympics_2016_v2',
		'パワーリフティング': 'Powerlifting_paralympics_2016_v2',
		'RHYTHMICGYMNASTICS': 'RhythmicGymnastics',
		'新体操': 'RhythmicGymnastics',
		'ROWING': 'Rowing',
		'ボート': 'Rowing',
		'RUGBYSEVENS': 'RugbySevens',
		'ラグビー': 'RugbySevens',
		'SAILING': 'Sailing',
		'セーリング': 'Sailing',
		'SHOOTING': 'Shooting',
		'SHOOTINGSPORT': 'Shooting_Sport_v2',
		'射撃': 'Shooting_Sport_v2',
		'SWIMMING': 'Swimming',
		'競泳': 'Swimming',
		'SYNCHRONISEDSWIMMING': 'SynchronisedSwimming',
		'シンクロ': 'SynchronisedSwimming',
		'TABLETENNIS': 'TableTennis',
		'卓球': 'TableTennis',
		'TAEKWONDO': 'Taekwondo',
		'テコンドー': 'Taekwondo',
		'TENNIS': 'Tennis',
		'テニス': 'Tennis',
		'TRAMPOLINEGYMNASTICS': 'TrampolineGymnastics',
		'トランポリン': 'TrampolineGymnastics',
		'TRIATHLON': 'Triathlon',
		'トライアスロン': 'Triathlon',
		'VOLLEYBALL': 'Volleyball',
		'バレー': 'Volleyball',
		'WATERPOLO': 'WaterPolo',
		'水球': 'WaterPolo',
		'WEIGHTLIFTING': 'Weightlifting',
		'ウエイトリフティング': 'Weightlifting',
		'WHEELCHAIRBASKETBALL': 'Wheelchair_Basketball_Fixed',
		'車椅子バスケットボール': 'Wheelchair_Basketball_Fixed',
		'WHEELCHAIRFENCING': 'Wheelchair_Fencing_Fixed',
		'車いすフェンシングバスケットボール': 'Wheelchair_Fencing_Fixed',
		'WHEELCHAIRTENNIS': 'Wheelchair_Tennis_Fixed',
		'車いすテニス': 'Wheelchair_Tennis_Fixed',
		'WHEELCHAIRRUGBY': 'Wheelchair_Rugby_Fixed',
		'WRESTLING': 'Wrestling',
		'レスリング': 'Wrestling',
		// ---- 冬季大会競技 ----
		'ALPINESKIING': 'AlpineSkiing_WO_18',
		'アルペンスキー': 'AlpineSkiing_WO_18',
		'BIATHLON': 'Biathlon_IO_18',
		'バイアスロン': 'Biathlon_IO_18',
		'CROSSCOUNTRYSKIING': 'CrossCountrySkiing_IW_2018',
		'クロスカントリースキー': 'CrossCountrySkiing_IW_2018',
		'CURLING': 'curling_IW_18',
		'カーリング': 'curling_IW_18',
		'FIGURESKATING': 'figureskating_IW_18',
		'フィギュアスケート': 'figureskating_IW_18',
		'FREESTYLESKIING': 'FreestyleSkiing_IW_18',
		'フリースタイルスキー': 'FreestyleSkiing_IW_18',
		'ICEHOCKEY': 'hockey_WO_18_v2',
		'アイスホッケー': 'hockey_WO_18_v2',
		'LUGE': 'luge_WO_18',
		'リュージュ': 'luge_WO_18',
		'NORDICCOMBINED': 'nordic_WO_18',
		'ノルディック複合': 'nordic_WO_18',
		'SHORTTRACKSKATING': 'shorttrackski_WO_18',
		'ショートトラックスピードスケート': 'shorttrackski_WO_18',
		'SKELETON': 'skeleton_WO_18',
		'スケルトン': 'skeleton_WO_18',
		'SKIJUMPING': 'skijump_WO_18',
		'スキージャンプ': 'skijump_WO_18',
		'SNOWBOARD': 'snowboard_WO_18',
		'スノーボード': 'snowboard_WO_18',
		'SPEEDSKATING': 'speedskate_WO_18',
		'スピードスケート': 'speedskate_WO_18',
		// ---- ポケットモンスター ----
		// https://twitter.com/ryuki100/status/1116113784811114497
		// https://twitter.com/ryuki100/status/1116367734449659905
		'フシギダネ': 'WBPikachu_Bulbasaur',
		'BULBASAUR': 'WBPikachu_Bulbasaur',
		'BULBIZARRE': 'WBPikachu_Bulbasaur',
		'BISASAM': 'WBPikachu_Bulbasaur',
		'이상해씨': 'WBPikachu_Bulbasaur',
		'妙蛙种子': 'WBPikachu_Bulbasaur',
		'妙蛙種子': 'WBPikachu_Bulbasaur',
		'БУЛЬБАЗАВР': 'WBPikachu_Bulbasaur',
		'ヒトカゲ': 'WBPikachu_Charmander',
		'CHARMANDER': 'WBPikachu_Charmander',
		'SALAMÈCHE': 'WBPikachu_Charmander',
		'GLUMANDA': 'WBPikachu_Charmander',
		'파이리': 'WBPikachu_Charmander',
		'小火龙': 'WBPikachu_Charmander',
		'小火龍': 'WBPikachu_Charmander',
		'ЧАРМАНДЕР': 'WBPikachu_Charmander',
		'ゼニガメ': 'WBPikachu_Squirtle_v2',
		'SQUIRTLE': 'WBPikachu_Squirtle_v2',
		'CARAPUCE': 'WBPikachu_Squirtle_v2',
		'SCHIGGY': 'WBPikachu_Squirtle_v2',
		'꼬부기': 'WBPikachu_Squirtle_v2',
		'杰尼龟': 'WBPikachu_Squirtle_v2',
		'傑尼龜': 'WBPikachu_Squirtle_v2',
		'СКВИРТЛ': 'WBPikachu_Squirtle_v2',
		'ミュウツー': 'WBPikachu_Mewtwo',
		'MEWTWO': 'WBPikachu_Mewtwo',
		'MEWTU': 'WBPikachu_Mewtwo',
		'뮤츠': 'WBPikachu_Mewtwo',
		'超梦': 'WBPikachu_Mewtwo',
		'超夢': 'WBPikachu_Mewtwo',
		'МЬЮТУ': 'WBPikachu_Mewtwo',
		'DETECTIVEPIKACHU': 'WB_Pikachu_2018',
		'ミュウ': 'Pokemon_Mew_2019_Emoji',
		'ミュウツーの逆襲': 'Pokemon_Mew_2019_Emoji',
		'ミュウツーの逆襲前夜祭': 'Pokemon_Mew_2019_Emoji',
		'すべてはここからはじまった': 'Pokemon_Mew_2019_Emoji',
		'GOSNAPSHOT': 'PokemonGoJP_GoSnapshot_2019',
		'ポケモン映画': 'PokemonCoCoMovieDec2020',
		'ザルード': 'PokemonCoCoMovieDec2020',
		'ポケットモンスターココ': 'PokemonCoCoMovieDec2020',
		'冬もポケモン': 'PokemonCoCoMovieDec2020',
		'父ちゃんだ': 'PokemonCoCoMovieDec2020',
		// [3月27日は「#さくらの日」](https://blog.twitter.com/ja_jp/topics/events/2019/sakura_day2019.html)
		'花見': 'CherryBlossom_Sakura_2019',
		'はなみ': 'CherryBlossom_Sakura_2019',
		'お花見': 'CherryBlossom_Sakura_2019',
		'おはなみ': 'CherryBlossom_Sakura_2019',
		'SAKURA': 'CherryBlossom_Sakura_2019',
		'開花宣言': 'CherryBlossom_Sakura_2019',
		'咲いた': 'CherryBlossom_Sakura_2019',
		'サクラ': 'CherryBlossom_Sakura_2019',
		'CHERRYBLOSSOM': 'CherryBlossom_Sakura_2019',
		'木之本桜': 'CherryBlossom_Sakura_2019', // https://twitter.com/TwitterJP/status/1110195453327335424
		// [Twitter上でお花見気分を味わおう](https://blog.twitter.com/ja_jp/topics/events/2019/sakura_day2020.html)
		'さくらの日': '2020_CherryBlossom',
		'桜': '2020_CherryBlossom',
		'さくら': '2020_CherryBlossom',
		'桜前線': '2020_CherryBlossom',
		'開花': '2020_CherryBlossom',
		'満開': '2020_CherryBlossom',
		'サクラサク': '2020_CherryBlossom',
		'夜桜': '2020_CherryBlossom',
		'間桐桜': '2020_CherryBlossom',
		'エア花見': '2020_CherryBlossom',
		'TLを花でいっぱいにしよう': 'CherryBlossom_2020_add',
		'TWITTERお花見2020': 'CherryBlossom_2020_add',
		'TWITTERお花見会': 'CherryBlossom_2020_add',
		'ツイッターお花見2020': 'CherryBlossom_2020_add',
		// [4月25日は「#世界ペンギンの日」](https://blog.twitter.com/ja_jp/topics/events/2019/Worldpenguinday.html)
		'世界ペンギンの日': 'WorldPenguinDay_2019',
		'WORLDPENGUINDAY': 'WorldPenguinDay_2019',
		// [「#こどもの日」と「#母の日」はTwitter上で家族へ感謝の気持ちや愛を伝えませんか？](https://blog.twitter.com/ja_jp/topics/events/2019/childrensday_mothersday.html)
		'こどもの日': 'ChildrensDay_2019',
		'子どもの日': 'ChildrensDay_2019',
		'親バカ部': 'ChildrensDay_2019',
		'母の日': 'MothersDay2020',
		'うちの母のここがスゴイ': 'MothersDay2020',
		'お母さんありがとう': 'MothersDay2020',
		'MOTHERSDAY': 'MothersDay2020',
		'HAPPYMOTHERSDAY': 'MothersDay2020',
		'어버이날': 'MothersDay2020',
		// [#平成を語ろうハロー令和](https://blog.twitter.com/ja_jp/topics/events/2019/Hello_Reiwa.html)
		// [Twitterで平成を振り返ろう](https://blog.twitter.com/ja_jp/topics/events/2019/letstalkHeisei_2019.html)
		'新元号を考えてみた': 'NewEra_2019',
		'平成を語ろう': 'NewEra_2019',
		'平成最後': 'Heisei_2018_v2',
		'令和': 'Reiwa_NewEra_2019',
		'令和元年': 'Reiwa_NewEra_2019',
		'ハロー令和': 'Reiwa_NewEra_2019',
		// [6月16日（日）「 #父の日 」にTwitterで #お父さんありがとう を伝えよう](https://blog.twitter.com/ja_jp/topics/events/2019/fathersday2019.html)
		'父の日': 'Fathers_Day_2020',
		'FATHERSDAY': 'Fathers_Day_2020',
		'お父さんありがとう': 'Fathers_Day_2020',
		'HAPPYFATHERSDAY': 'Fathers_Day_2020',
		// ---- 新海誠監督映画 ----
		'君の名は': 'YourNameMovie_2019',
		'YOURNAME': 'YourNameMovie_2019',
		'天気の子': 'Toho_Tenkinoko_2019',
		'WEATHERINGWITHYOU': 'Toho_Tenkinoko_2019',
		// ---- アベンジャーズ ----
		'アベンジャーズ': 'Avengers_Endgame_2019',
		'AVENGERS': 'Avengers_Endgame_2019',
		'AVENGERSENDGAME': 'Avengers_Endgame_2019',
		'DONTSPOILTHEENDGAME': 'Avengers_Endgame_2019',
		'0426逆襲へ': 'Avengers_Endgame_2019',
		'ありがとうアベンジャーズ': 'Avengers_Endgame_2019',
		'ANTMAN': 'Avengers_Endgame_2019_AntMan',
		'アントマン': 'Avengers_Endgame_2019_AntMan',
		'BLACKPANTHER': 'Avengers_Endgame_2019_BlackPanther',
		'ブラックパンサー': 'Avengers_Endgame_2019_BlackPanther',
		'BLACKWIDOW': 'Avengers_Endgame_2019_BlackWidow',
		'ブラックウィドウ': 'Avengers_Endgame_2019_AntMan',
		'CAPTAINAMERICA': 'Avengers_Endgame_2019_CaptainAmerica',
		'キャプテンアメリカ': 'Avengers_Endgame_2019_CaptainAmerica',
		'CAPTAINMARVEL': 'Avengers_Endgame_2019_CaptainMarvel',
		'キャプテンマーベル': 'Avengers_Endgame_2019_CaptainMarvel',
		'DOCTORSTRANGE': 'Avengers_Endgame_2019_DoctorStrange',
		'ドクターストレンジ': 'Avengers_Endgame_2019_DoctorStrange',
		'DRAX': 'Avengers_Endgame_2019_Drax',
		'ドラックス': 'Avengers_Endgame_2019_Drax',
		'GAMORA': 'Avengers_Endgame_2019_Gamora',
		'ガモーラ': 'Avengers_Endgame_2019_Gamora',
		'GROOT': 'Avengers_Endgame_2019_Groot',
		'グルート': 'Avengers_Endgame_2019_Groot',
		'HAPPYHOGAN': 'Avengers_Endgame_2019_HappyHogan',
		'ハッピーホーガン': 'Avengers_Endgame_2019_HappyHogan',
		'HAWKEYE': 'Avengers_Endgame_2019_Hawkeye',
		'ホークアイ': 'Avengers_Endgame_2019_Hawkeye',
		'HULK': 'Avengers_Endgame_2019_Hulk',
		'ハルク': 'Avengers_Endgame_2019_Hulk',
		'INFINITYGAUNTLET': 'Avengers_Endgame_2019_InfinityGauntlet',
		'インフィニティガントレット': 'Avengers_Endgame_2019_InfinityGauntlet',
		'INFINITYSTONES': 'Avengers_Endgame_2019_InfinityGauntlet',
		'INFINITYSTONE': 'Avengers_Endgame_2019_InfinityGauntlet',
		'IRONMAN': 'Avengers_Endgame_2019_IronMan',
		'アイアンマン': 'Avengers_Endgame_2019_IronMan',
		'KEVINFEIGE': 'Avengers_Endgame_2019_KevinFeige',
		'KORG': 'Avengers_Endgame_2019_Korg',
		'コーグ': 'Avengers_Endgame_2019_Korg',
		'LOKI': 'Avengers_Endgame_2019_Loki',
		'ロキ': 'Avengers_Endgame_2019_Loki',
		'MBAKU': 'Avengers_Endgame_2019_Mbaku',
		'エムバク': 'Avengers_Endgame_2019_Mbaku',
		'MANTIS': 'Avengers_Endgame_2019_Mantis',
		'マンティス': 'Avengers_Endgame_2019_Mantis',
		'MARIAHILL': 'Avengers_Endgame_2019_MariaHill',
		'マリアヒル': 'Avengers_Endgame_2019_MariaHill',
		'MARVELSTUDIOS': 'Avengers_Endgame_2019_KevinFeige',
		'MIEK': 'Avengers_Endgame_2019_Miek',
		'ミーク': 'Avengers_Endgame_2019_Miek',
		'NEBULA': 'Avengers_Endgame_2019_Nebula',
		'ネビュラ': 'Avengers_Endgame_2019_Nebula',
		'NICKFURY': 'Avengers_Endgame_2019_NickFury',
		'ニックフューリー': 'Avengers_Endgame_2019_NickFury',
		'OKOYE': 'Avengers_Endgame_2019_Okoye',
		'オコエ': 'Avengers_Endgame_2019_Okoye',
		'PEPPERPOTTS': 'Avengers_Endgame_2019_PepperPotts',
		'ペッパーポッツ': 'Avengers_Endgame_2019_PepperPotts',
		'ROCKETRACCOON': 'Avengers_Endgame_2019_Rocket',
		'ロケット': 'Avengers_Endgame_2019_Rocket',
		'RONIN': 'Avengers_Endgame_2019_Hawkeye',
		'SCARLETWITCH': 'Avengers_Endgame_2019_ScarletWitch',
		'スカーレットウィッチ': 'Avengers_Endgame_2019_ScarletWitch',
		'SHURI': 'Avengers_Endgame_2019_Shuri',
		'シュリ': 'Avengers_Endgame_2019_Shuri',
		'SPIDERMAN': 'Avengers_Endgame_2019_Spiderman',
		'スパイダーマン': 'Avengers_Endgame_2019_Spiderman',
		'STARLORD': 'Avengers_Endgame_2019_Starlord',
		'スターロード': 'Avengers_Endgame_2019_Starlord',
		'THANOS': 'Avengers_Endgame_2019_Thanos',
		'サノス': 'Avengers_Endgame_2019_Thanos',
		'THEFALCON': 'Avengers_Endgame_2019_Falcon',
		'ファルコン': 'Avengers_Endgame_2019_Falcon',
		'THESTONEKEEPER': 'Avengers_Endgame_2019_RedSkull',
		'THEVALKYRIE': 'Avengers_Endgame_2019_Valkyrie',
		'ヴァルキリー': 'Avengers_Endgame_2019_Valkyrie',
		'THEWASP': 'Avengers_Endgame_2019_Wasp',
		'ワスプ': 'Avengers_Endgame_2019_Wasp',
		'THOR': 'Avengers_Endgame_2019_Thor',
		'ソー': 'Avengers_Endgame_2019_Thor',
		'WARMACHINE': 'Avengers_Endgame_2019_WarMachine',
		'ウォーマシン': 'Avengers_Endgame_2019_WarMachine',
		'WINTERSOLDIER': 'Avengers_Endgame_2019_WinterSoldier',
		'ウィンターソルジャー': 'Avengers_Endgame_2019_WinterSoldier',
		'WONG': 'Avengers_Endgame_2019_Wong',
		'ウォン': 'Avengers_Endgame_2019_Wong',
		// ---- トイ・ストーリー 4 ----
		'TOYSTORY': 'Disney_ToyStory4_Woody_v2',
		'TOYSTORY4': 'Disney_ToyStory4_Woody_v2',
		'トイストーリー4': 'Disney_ToyStory4_Woody_v2',
		'WOODY': 'Disney_ToyStory4_Woody_v2',
		'ウッディ': 'Disney_ToyStory4_Woody_v2',
		'BOPEEP': 'Disney_ToyStory4_BoPeep',
		'ボーピープ': 'Disney_ToyStory4_BoPeep',
		'BUZZLIGHTYEAR': 'Disney_ToyStory4_Buzz',
		'バズライトイヤー': 'Disney_ToyStory4_Buzz',
		'DUCKYBUNNY': 'Disney_ToyStory4_ActualDuckyBunny',
		'DUCKYANDBUNNY': 'Disney_ToyStory4_ActualDuckyBunny',
		'PLUSHRUSH': 'Disney_ToyStory4_ActualDuckyBunny',
		'DUKECABOOM': 'Disney_ToyStory4_DukeCaboom',
		'FORKY': 'Disney_ToyStory4_Forky',
		'フォーキー': 'Disney_ToyStory4_Forky',
		'GIGGLEMCDIMPLES': 'Disney_ToyStory4_DuckyBunny',
		'いつまでも君はともだち': 'ToyStory4_Woody_Japan',
		'トイ4の夏がきた': 'ToyStory4_Woody_Japan',
		// [#夢のオールスター マイナビオールスターゲーム2019](https://blog.twitter.com/ja_jp/topics/events/2019/All-star-game.html)
		'マイナビオールスターゲーム2019': 'AllStar_Baseball_Game_2019',
		'オールスター': 'AllStar_Baseball_Game_2019',
		'夢のオールスター': 'AllStar_Baseball_Game_2019',
		'球宴': 'AllStar_Baseball_Game_2019',
		// ---- Amazon PrimeDay ----
		'AMAZON': 'AmazonPrimeDay_2019',
		'PRIMEDAYAMAZON': 'AmazonHotSale2019',
		'プライムデー': 'PrimeDay_2020_JP',
		'プライムデイ': 'PrimeDay_2020_JP',
		'プライムセール': 'PrimeDay_2020_JP',
		'アマゾン': 'PrimeDay_2020_JP',
		'PRIMEDAY': 'Amazon_PrimeDay_2020_CA_Brasil',
		'PRIMEDAY2020': 'Amazon_PrimeDay_2020_CA_Brasil',
		'PRIMEDAY20': 'Amazon_PrimeDay_2020_CA_Brasil',
		'PRIMEDAYBRASIL': 'Amazon_PrimeDay_2020_CA_Brasil',
		'AMAZONPRIMEDAY': 'Amazon_PrimeDay_2020_CA_Brasil',
		// ---- Disney_Aladdin_2019 ----
		'ALADDIN': 'Disney_Aladdin_2019',
		'アラジン': 'Disney_Aladdin_2019',
		'JASMINE': 'Disney_Aladdin_Jasmine',
		'ジャスミン': 'Disney_Aladdin_Jasmine',
		'WHOLENEWWORLD': 'Disney_Aladdin_Jasmine',
		'AWHOLENEWWORLD': 'Disney_Aladdin_Jasmine',
		'GENIE': 'Disney_Aladdin_Genie',
		'ジーニー': 'Disney_Aladdin_Genie',
		'FRIENDLIKEME': 'Disney_Aladdin_Genie',
		'MAGICLAMP': 'Disney_Aladdin_Lamp',
		'魔法のランプ': 'Disney_Aladdin_Lamp',
		'アラジンと新しい世界へ': 'Disney_Aladdin_Lamp',
		// ---- G20Osaka_2019 ----
		// https://twitter.com/TwitterGovJP/status/1135375663060344832
		'G20': 'G20Osaka_2019',
		'G20SUMMIT': 'G20Osaka_2019',
		'G20JAPAN': 'G20Osaka_2019',
		'G20OSAKA': 'G20Osaka_2019',
		'G2019': 'G20Osaka_2019',
		'G20大阪': 'G20Osaka_2019',
		'G20大阪サミット': 'G20Osaka_2019',
		'G20サミット': 'G20Osaka_2019',
		'G20OSAKASUMMIT': 'G20Osaka_2019',
		'G20INOSAKA': 'G20Osaka_2019',
		'G20閣僚会合': 'G20Osaka_2019',
		// [#参院選2019 Twitter上でニッポンの政治を知ろう、語ろう](https://blog.twitter.com/ja_jp/topics/company/2019/election_2019.html)
		'選挙': 'GoVoteUpperHouseElection_2019',
		'参院選': 'GoVoteUpperHouseElection_2019',
		'参院選2019': 'GoVoteUpperHouseElection_2019',
		'令和初の参院選': 'GoVoteUpperHouseElection_2019',
		'東京都知事選挙': '2020_TokyoGubernatorialElection',
		'東京都知事選': '2020_TokyoGubernatorialElection',
		'都知事選': '2020_TokyoGubernatorialElection',
		'選挙に行こう': '2020_TokyoGubernatorialElection',
		// [7月17日は #世界絵文字デー](https://blog.twitter.com/ja_jp/topics/events/2019/World-Emoji-Day-2019.html)
		'世界絵文字デー': 'WorldEmojiDay_2019',
		'鳥取': 'WorldEmojiDay_2019',
		'鳥取県': 'WorldEmojiDay_2019',
		'絵文字で鳥取県': 'WorldEmojiDay_2019',
		'おしどり': 'WorldEmojiDay_2019',
		'絵文字': 'WorldEmojiDay_2019',
		'EMOJI': 'WorldEmojiDay_2019',
		'WORLDEMOJIDAY': 'WorldEmojiDay_2019',
		// [#Twitterトレンド大賞 presents #Twitter夏祭り 開催が決定！](https://blog.twitter.com/ja_jp/topics/events/2019/twitter-trend-award-natsumatsuri-2019.html)
		'TWITTER夏祭り': 'SummerFestival_2020',
		'TWITTERトレンド大賞': 'TwitterTrendAward_2020',
		'TWITTERTRENDAWARD': 'TwitterTrendAward_2020',
		'ローソン屋台': 'TwitterTrendAward_Summer_Emoji',
		'放置少女屋台': 'TwitterTrendAward_Summer_Emoji',
		'サマーウォーズ屋台': 'TwitterTrendAward_Summer_Emoji',
		// [#防災の日 もしもの際に備え、災害・防災に関する様々な取り組みを実施](https://blog.twitter.com/ja_jp/topics/events/2019/lifeline_2019.html)
		'防災の日': 'Disaster_Prevention_Day_2019_Emoji_GIF_V3',
		'防災': 'Disaster_Prevention_Day_2019_Emoji_GIF_V3',
		'防災豆知識': 'Disaster_Prevention_Day_2019_Emoji_GIF_V3',
		'非常時に知っておくと役立つ便利情報': 'Disaster_Prevention_Day_2019_Emoji_GIF_V3',
		'東京防災': 'Tokyo_Disaster_Prevention_Day_2019_Mascot_Emoji_GIF',
		'防サイくん': 'Tokyo_Disaster_Prevention_Day_2019_Mascot_Emoji_GIF',
		'今やろう': 'Tokyo_Disaster_Prevention_Day_2019_Mascot_Emoji_GIF',
		// https://twitter.com/TwitterJP/status/1366252059482202113
		'あの日から10年': '311Tohokumemorial_2021_v3',
		'あれから10年': '311Tohokumemorial_2021_v3',
		'あれから私は': '311Tohokumemorial_2021_v3',
		'これから私は': '311Tohokumemorial_2021_v3',
		'東北ボランティア': '311Tohokumemorial_2021_v3',
		'防災いまできること': '311Tohokumemorial_2021_v3',
		'10YEARSLATER': '311Tohokumemorial_2021_v3',
		'10ปีถัดมา': '311Tohokumemorial_2021_v3',
		'10AÑOSDESPUÉS': '311Tohokumemorial_2021_v3',
		'10ANSAPRÈS': '311Tohokumemorial_2021_v3',
		'10JAHRESPÄTER': '311Tohokumemorial_2021_v3',
		'10ÅRSENARE': '311Tohokumemorial_2021_v3',
		'10ЛЕТСПУСТЯ': '311Tohokumemorial_2021_v3',
		'10ΧΡΌΝΙΑΑΡΓΌΤΕΡΑ': '311Tohokumemorial_2021_v3',
		'10YILSONRA': '311Tohokumemorial_2021_v3',
		'10ANNIDOPO': '311Tohokumemorial_2021_v3',
		'10JAARLATER': '311Tohokumemorial_2021_v3',
		'LOVEFORTOHOKU': '311Tohokumemorial_2021_v3',
		'PRAYFORTOHOKU': '311Tohokumemorial_2021_v3',
		// [Twitter、グローバルで自殺防止の取り組みを支援](https://blog.twitter.com/ja_jp/topics/company/2019/WSPD_2019.html)
		'WORLDSUICIDEPREVENTIONDAY': 'WorldSuicidePreventionDay_2020',
		'世界自殺予防デー': 'WorldSuicidePreventionDay_2020',
		'自殺予防週間': 'WorldSuicidePreventionDay_2020',
		'相談してみよう': 'WorldSuicidePreventionDay_2020',
		'弱音を吐こう': 'WorldSuicidePreventionDay_2020',
		'WSPD': 'WorldSuicidePreventionDay_2020',
		'WSPD2020': 'WorldSuicidePreventionDay_2020',
		'SUICIDEPREVENTION': 'WorldSuicidePreventionDay_2020',
		'10SEP': 'WorldSuicidePreventionDay_2020',
		'LIGHTACANDLE': 'WorldSuicidePreventionDay_2020',
		'自殺対策強化月間': 'JapanSuicidePreventionMonth_2021',
		'相談しよう': 'JapanSuicidePreventionMonth_2021',
		'いのち支える': 'JapanSuicidePreventionMonth_2021',
		// ---- Rugby_World_Cup_2019_EMOJI_RWC2019 ----
		'RWC2019': 'Rugby_World_Cup_2019_EMOJI_RWC2019',
		'WEBBELLISCUP': 'Rugby_World_Cup_2019_EMOJI_WebbEllisCup',
		'GOLDBLOODED': 'Rugby_World_Cup_2019_Emojis_GoldBlooded_V2',
		'ONETEAM': 'OneTeam_2019_NewDesign',
		'RWC札幌': 'Rugby_World_Cup_2019_EMOJI_RWCSapporo',
		'RWC釜石': 'Rugby_World_Cup_2019_EMOJI_Kamaishi',
		'RWC熊谷': 'Rugby_World_Cup_2019_EMOJI_Kumagaya',
		'RWC東京': 'Rugby_World_Cup_2019_EMOJI_Tokyo',
		'RWC横浜': 'Rugby_World_Cup_2019_EMOJI_Yokohama',
		'RWC静岡': 'Rugby_World_Cup_2019_EMOJI_Shizuoka',
		'RWC豊田': 'Rugby_World_Cup_2019_EMOJI_CityOfToyota',
		'RWC花園': 'Rugby_World_Cup_2019_EMOJI_Hanazono',
		'RWC神戸': 'Rugby_World_Cup_2019_EMOJI_Kobe_V2',
		'RWC福岡': 'Rugby_World_Cup_2019_EMOJI_Fukuoka',
		'RWC熊本': 'Rugby_World_Cup_2019_EMOJI_Kumamoto',
		'RWC大分': 'Rugby_World_Cup_2019_EMOJI_Oita',
		'RWCSAPPORO': 'Rugby_World_Cup_2019_EMOJI_RWCSapporo',
		'RWCKAMAISHI': 'Rugby_World_Cup_2019_EMOJI_Kamaishi',
		'RWCKUMAGAYA': 'Rugby_World_Cup_2019_EMOJI_Kumagaya',
		'RWCTOKYO': 'Rugby_World_Cup_2019_EMOJI_Tokyo',
		'RWCYOKOHAMA': 'Rugby_World_Cup_2019_EMOJI_Yokohama',
		'RWCSHIZUOKA': 'Rugby_World_Cup_2019_EMOJI_Shizuoka',
		'RWCCITYOFTOYOTA': 'Rugby_World_Cup_2019_EMOJI_CityOfToyota',
		'RWCHANAZONO': 'Rugby_World_Cup_2019_EMOJI_Hanazono',
		'RWCKOBE': 'Rugby_World_Cup_2019_EMOJI_Kobe_V2',
		'RWCFUKUOKA': 'Rugby_World_Cup_2019_EMOJI_Fukuoka',
		'RWCKUMAMOTO': 'Rugby_World_Cup_2019_EMOJI_Kumamoto',
		'RWCOITA': 'Rugby_World_Cup_2019_EMOJI_Oita',
		'JPNVRUS': 'Rugby_World_Cup_2019_EMOJI_JPNvRUS',
		'AUSVFIJ': 'Rugby_World_Cup_2019_EMOJI_AUSvFIJ_V2',
		'FRAVARG': 'Rugby_World_Cup_2019_EMOJI_FRAvARG_V2',
		'NZLVRSA': 'Rugby_World_Cup_2019_EMOJI_NZLvRSA',
		'ITAVNAM': 'Rugby_World_Cup_2019_EMOJI_ITAvNAM',
		'IREVSCO': 'Rugby_World_Cup_2019_EMOJI_IREvSCO',
		'ENGVTGA': 'Rugby_World_Cup_2019_EMOJI_ENGvTGA',
		'WALVGEO': 'Rugby_World_Cup_2019_EMOJI_WALvGEO',
		'RUSVSAM': 'Rugby_World_Cup_2019_EMOJI_RUSvSAM',
		'FIJVURU': 'Rugby_World_Cup_2019_EMOJI_FIGvURG',
		'ITAVCAN': 'Rugby_World_Cup_2019_EMOJI_ITAvCAN',
		'ENGVUSA': 'Rugby_World_Cup_2019_EMOJI_ENGvUSA',
		'ARGVTGA': 'Rugby_World_Cup_2019_EMOJI_ARGvTGA',
		'JPNVIRE': 'Rugby_World_Cup_2019_EMOJI_JPNvIRE',
		'RSAVNAM': 'Rugby_World_Cup_2019_EMOJI_RSAvNAM',
		'GEOVURU': 'Rugby_World_Cup_2019_EMOJI_GEOvURU',
		'AUSVWAL': 'Rugby_World_Cup_2019_EMOJI_AUSvWAL',
		'SCOVSAM': 'Rugby_World_Cup_2019_EMOJI_SCOvSAM',
		'FRAVUSA': 'Rugby_World_Cup_2019_EMOJI_FRAvUSA',
		'NZLVCAN': 'Rugby_World_Cup_2019_EMOJI_NZLvCAN',
		'GEOVFIJ': 'Rugby_World_Cup_2019_EMOJI_GEOvFIJ',
		'IREVRUS': 'Rugby_World_Cup_2019_EMOJI_IREvRUS',
		'RSAVITA': 'Rugby_World_Cup_2019_EMOJI_RSAvITA',
		'AUSVURU': 'Rugby_World_Cup_2019_EMOJI_AUSvURU',
		'ENGVARG': 'Rugby_World_Cup_2019_EMOJI_ENGvARG',
		'JPNVSAM': 'Rugby_World_Cup_2019_EMOJI_JPNvSAM',
		'NZLVNAM': 'Rugby_World_Cup_2019_EMOJI_NZLvNAM',
		'FRAVTGA': 'Rugby_World_Cup_2019_EMOJI_FRAvTGA',
		'RSAVCAN': 'Rugby_World_Cup_2019_EMOJI_RSAvCAN',
		'ARGVUSA': 'Rugby_World_Cup_2019_EMOJI_ARGvUSA',
		'SCOVRUS': 'Rugby_World_Cup_2019_EMOJI_SCOvRUS',
		'WALVFIJ': 'Rugby_World_Cup_2019_EMOJI_WALvFIJ',
		'AUSVGEO': 'Rugby_World_Cup_2019_EMOJI_AUSvGEO',
		'NZLVITA': 'Rugby_World_Cup_2019_EMOJI_NZLvITA',
		'ENGVFRA': 'Rugby_World_Cup_2019_EMOJI_ENGvFRA',
		'IREVSAM': 'Rugby_World_Cup_2019_EMOJI_IREvSAM',
		'NAMVCAN': 'Rugby_World_Cup_2019_EMOJI_NAMvCAN',
		'USAVTGA': 'Rugby_World_Cup_2019_EMOJI_USAvTGA',
		'WALVURU': 'Rugby_World_Cup_2019_EMOJI_WALvURU',
		'JPNVSCO': 'Rugby_World_Cup_2019_EMOJI_JPNvSCO',
		'STARTSOMETHINGPRICELESS': 'StartSomethingPriceless_Rugby_World_Cup_Emoji',
		// ---- HALLOWEEN ----
		'ハロウィン': 'Halloween_2020',
		'トリックオアトリート': 'Halloween_2020',
		'HALLOWEEN': 'Halloween_2020',
		'HALLOWEEN19': 'Halloween2019_Emoji_GIF',
		'HALLOWEEN2019': 'Halloween2019_Emoji_GIF',
		'할로윈': 'Halloween_2020',
		'ハッピーハロウィン': 'Halloween_2020',
		'HAPPYHALLOWEEN': 'Halloween_2020',
		'해피할로윈': 'Halloween_2020',
		'HALLOWEEN2020': 'Halloween_2020',
		'할로윈2020': 'Halloween_2020',
		'HALLOWEEN20': 'Halloween_2020',
		'HAPPYHALLOWEEN2020': 'Halloween_2020',
		'HAPPYHALLOWEEN20': 'Halloween_2020',
		// ---- DogDay2019 ----
		'いぬの日': 'DogDay2019_Emoji_GIF',
		'イヌの日': 'DogDay2019_Emoji_GIF',
		'わんわんわんの日': 'DogDay2019_Emoji_GIF',
		'うちの犬': 'DogDay2019_Emoji_GIF',
		// https://twitter.com/TwitterJP/status/1193353369672241152
		'即位の礼': 'EnthronementCeremony_Emoji_GIF',
		'祝賀御列の儀': 'EnthronementCeremony_Emoji_GIF',
		'即位礼正殿の儀': 'EnthronementCeremony_Emoji_GIF',
		'JAPANENTHRONEMENT': 'EnthronementCeremony_Emoji_GIF',
		'JPNENTHRONEMENT': 'EnthronementCeremony_Emoji_GIF',
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
		// [年末年始はTwitterで 「#あけおめ」](https://blog.twitter.com/ja_jp/topics/events/2019/newyear-tweet-2019.html)
		'あけおめ': 'NewYearCelebration_Japan2020_sunrise',
		'謹賀新年': 'NewYearCelebration_Japan2020_sunrise',
		'あけましておめでとう': 'NewYearCelebration_Japan2020_sunrise',
		'初詣': 'NewYearCelebration_Japan2020_temple',
		'初詣で': 'NewYearCelebration_Japan2020_temple',
		'富士': 'NewYearCelebration_Japan2020_mtfuji',
		'鷹': 'NewYearCelebration_Japan2020_hawk',
		'茄子': 'NewYearCelebration_Japan2020_eggplant',
		'なすび': 'NewYearCelebration_Japan2020_eggplant',
		'ナスビ': 'NewYearCelebration_Japan2020_eggplant',
		// [#全員団結 絵文字が出ます](https://blog.twitter.com/ja_jp/topics/company/2019/danketsu-olympic.html)
		'全員団結': 'JapanOlympicBrandTogether2020',
		'LAUSANNE2020': 'Lausanne_2020',
		// Meiji_THEChocolate_JP_2020
		'明治ザ・チョコレート': 'Meiji_THEChocolate_JP_2020',
		'ザチョコレート': 'Meiji_THEChocolate_JP_2020',
		'ザチョコ': 'Meiji_THEChocolate_JP_2020',
		'レシート漫画': 'Meiji_THEChocolate_JP_2020',
		// AsahiMitsuyaJapan_2020
		'3月28日は三ツ矢の日': 'AsahiMitsuyaJapan_2020',
		'三ツ矢サイダー': 'AsahiMitsuyaJapan_2020',
		'嵐と三ツ矢でカンパイ': 'AsahiMitsuyaJapan_2020',
		'日本にはおいしいサイダーがある': 'AsahiMitsuyaJapan_2020',
		// AnimalCrossing_Nintendo_2020_NewArtwork
		'あつまれどうぶつの森': 'AnimalCrossing_Nintendo_2020_NewArtwork_v2',
		'どうぶつの森': 'AnimalCrossing_Nintendo_2020_NewArtwork_v2',
		'ACNH': 'AnimalCrossing_Nintendo_2020_NewArtwork_v2',
		'ANIMALCROSSING': 'AnimalCrossing_Nintendo_2020_NewArtwork_v2',
		'ANIMALCROSSINGNEWHORIZONS': 'AnimalCrossing_Nintendo_2020_NewArtwork_v2',
		// KIRINSoccerJapan_2020
		'キリチャレの日': 'KIRINSoccerJapan_2020',
		'届けてキリン': 'KIRINSoccerJapan_2020',
		'聖獣麒麟': 'KIRINSoccerJapan_2020',
		// ---- 国際女性デー ----
		'IWD2020': 'IWD_2020',
		'国際女性デー': 'InternationalWomensDay2021',
		'INTERNATIONALWOMENSDAY': 'InternationalWomensDay2021',
		'IWD': 'InternationalWomensDay2021',
		'IWD2021': 'InternationalWomensDay2021',
		'女性デー': 'InternationalWomensDay2021',
		'WOMENSDAY': 'InternationalWomensDay2021',
		'女性史月間': 'InternationalWomensDay2021',
		'WOMENSHISTORYMONTH': 'InternationalWomensDay2021',
		'WHM': 'InternationalWomensDay2021',
		'WHM2021': 'InternationalWomensDay2021',
		'平等を目指す全ての世代': 'InternationalWomensDay2021',
		'GENERATIONEQUALITY': 'InternationalWomensDay2021',
		'WOMENSMARCHMY': 'InternationalWomensDay2021',
		'WOMENMARCHMY': 'InternationalWomensDay2021',
		'8M2021': 'InternationalWomensDay2021',
		'私たちは女性': 'TwitterWomenTentpole_2021',
		'WEAREWOMEN': 'TwitterWomenTentpole_2021',
		// [ツイートは誰かの応援になる Twitter JapanとYahoo! JAPANが三陸地方応援企画を実施](https://blog.twitter.com/ja_jp/topics/company/2019/311_sanriku.html)
		'がんばれ三鉄': 'RootforSanrikuRailway_2020',
		'頑張れ三鉄': 'RootforSanrikuRailway_2020',
		'がんばれ三陸': 'RootforSanrikuRailway_2020',
		'頑張れ三陸': 'RootforSanrikuRailway_2020',
		'三鉄': 'RootforSanrikuRailway_2020',
		'三陸鉄道': 'RootforSanrikuRailway_2020',
		'三陸鉄道リアス線': 'RootforSanrikuRailway_2020',
		// https://twitter.com/TwitterJP/status/1239837709633351680
		'手洗い': 'WHO_SafeHands_2020',
		'手を洗おう': 'WashYourHands_2020_2021_ext2',
		'手洗いチャレンジ': 'WHO_SafeHands_2020',
		'HANDWASHING': 'WHO_SafeHands_2020',
		'SAFEHANDS': 'WHO_SafeHands_2020',
		'HANDWASHCHALLENGE': 'WHO_SafeHands_2020',
		'HANDWASHINGCHALLENGE': 'WHO_SafeHands_2020',
		'WASHYOURHANDS': 'WashYourHands_2020_2021_ext2',
		'STAYHOME': 'StayHome_2020_2021_ext2',
		'STAYATHOME': 'StayHome_2020',
		'STAYATHOMESAVELIVES': 'StayHome_2020',
		'STAYHOMECHALLENGE': 'StayHome_2020',
		'HEALTHYATHOME': 'StayHome_2020_2021_ext2',
		'うちで過ごそう': 'StayHome_2020_2021_ext2',
		'家で過ごそう': 'StayHome_2020',
		'家にいるだけで世界は救える': 'StayHome_2020',
		'ステイホーム': 'StayHome_2020_2021_ext2',
		'WORLDHEALTHDAY': 'StayHome_2020_WorldHealthDay_add1',
		'世界保健デー': 'StayHome_2020_WorldHealthDay_add1',
		// ---- アースデー ----
		'EARTHDAY2020': 'EarthDay_2020_add2',
		'TWITTERFORGOOD': 'TwitterForGood_2020',
		'TWITTERFORGOODDAY': 'TwitterForGood_2020',
		'TFGDAY': 'TwitterForGood_2020',
		'TFG': 'TwitterForGood_2020',
		'FRIDAYFORGOOD': 'TwitterForGood_2020',
		'世界環境デー': 'WorldEnvironmentDay_ForNature_2020',
		'WORLDENVIRONMENTDAY': 'WorldEnvironmentDay_ForNature_2020',
		'FORNATURE': 'WorldEnvironmentDay_ForNature_2020',
		'アースデー': 'EarthDay_2021_add',
		'環境の日': 'EarthDay_2021_add',
		'EARTHDAY': 'EarthDay_2021_add',
		'EARTHDAY2021': 'EarthDay_2021_add',
		'EARTHRISE': 'EarthDay_2021_add',
		'CLIMATEACTION': 'EarthDay_2021_add',
		'VOTEEARTH': 'EarthDay_2021_add',
		'VOICEFORTHEPLANET': 'EarthDay_2021_add',
		'WORLDWITHOUTNATURE': 'EarthDay_2021_add',
		// https://twitter.com/TwitterJP/statuses/1256109065106669569
		'世界報道自由デー': 'WorldPressFreedomDay_2021',
		'記者に感謝': 'WorldPressFreedomDay_2020',
		'報道の自由': 'WorldPressFreedomDay_2021',
		'記者をフォローしよう': 'WorldPressFreedomDay_2021',
		'ジャーナリストをフォローしよう': 'WorldPressFreedomDay_2021',
		'THANKAJOURNALIST': 'WorldPressFreedomDay_2020',
		'WORLDPRESSFREEDOMDAY': 'WorldPressFreedomDay_2021',
		'WPFD2020': 'WorldPressFreedomDay_2020',
		'WPFD2021': 'WorldPressFreedomDay_2021',
		'PRESSFREEDOM': 'WorldPressFreedomDay_2021',
		// ---- TogetherWeCan LetsTalk ----
		'一人で抱え込まないで': 'MentalHealthMonth_2021_add2',
		'RECOVERTOGETHER': 'MentalHealthMonth_2021_add2',
		'TOGETHERWECAN': 'MentalHealthMonth_2021_add2',
		'WECARE': 'MentalHealthMonth_2021_add2',
		'世界メンタルヘルスデー': 'WorldMentalHealthDay_2020',
		'メンタルヘルス': 'WorldMentalHealthDay_2020',
		'話すのも悪くない': 'MentalHealthMonth_2021_add2',
		'WORLDMENTALHEALTHDAY': 'WorldMentalHealthDay_2020',
		'WMHD2020': 'WorldMentalHealthDay_2020',
		'MENTALHEALTH': 'MentalHealthMonth_2021',
		'MENTALHEALTHMATTERS': 'MentalHealthMonth_2021',
		'MENTALHEALTHFORALL': 'WorldMentalHealthDay_2020',
		'MOVEFORMENTALHEALTH': 'WorldMentalHealthDay_2020',
		'MENTALHEALTHMONTH': 'MentalHealthMonth_2021_add',
		'MHM2021': 'MentalHealthMonth_2021_add',
		'GETREAL': 'MentalHealthMonth_2021_add',
		'LETSTALK': 'MentalHealthMonth_2021_add2',
		'いじめ防止': 'BullyingPreventionMonth_2020',
		'BULLYINGPREVENTIONMONTH': 'BullyingPreventionMonth_2020',
		'ANTIBULLYINGWEEK': 'BullyingPreventionMonth_2020',
		'ANTIBULLYING': 'BullyingPreventionMonth_2020',
		'UNITEDAGAINSTBULLYING': 'BullyingPreventionMonth_2020',
		'HARDTOSEE': 'BullyingPreventionMonth_2020',
		'STOPSPEAKSUPPORT': 'BullyingPreventionMonth_2020',
		'BEANUPSTANDER': 'BullyingPreventionMonth_2020',
		'CLICKWITHCOMPASSION': 'BullyingPreventionMonth_2020',
		'CHOOSERESPECT': 'BullyingPreventionMonth_2020',
		'BEKIND': 'BullyingPreventionMonth_2020',
		'ODDSOCKSDAY': 'BullyingPreventionMonth_2020',
		// ---- SocialGoodPJ_ThankYouEveryone ----
		'あたりまえにありがとう': 'SocialGoodPJ_ThankYouEveryone_2020',
		'わたしたちにできること': 'SocialGoodPJ_ThankYouEveryone_2020',
		// ---- 放置少女 ----
		'放置少女': 'Houchishoujo_Q2_2020',
		'放置少女3周年': 'Houchishoujo_Q2_2020',
		'LOVE放置少女': 'Houchishoujo_Q2_2020',
		'いつもあなたのそばに〜放置少女': 'Houchishoujo_Q1_2020_V2',
		'放置し過ぎないでね〜': 'Houchishoujo_Q1_2020_V2',
		// https://twitter.com/TwitterJP/status/1260379335321518082
		'ありがとう': 'Thankful_Grateful_2020',
		'有り難う': 'Thankful_Grateful_2020',
		'有難う': 'Thankful_Grateful_2020',
		'ありがとうございます': 'Thankful_Grateful_2020',
		'ありがと': 'Thankful_Grateful_2020',
		'アリガト': 'Thankful_Grateful_2020',
		'ありがたい': 'Thankful_Grateful_2020',
		'有り難い': 'Thankful_Grateful_2020',
		'有難い': 'Thankful_Grateful_2020',
		'サンキュ': 'Thankful_Grateful_2020',
		'さんきゅ': 'Thankful_Grateful_2020',
		'感謝': 'Thankful_Grateful_2020',
		'謝意': 'Thankful_Grateful_2020',
		'THANKYOU': 'Thankful_Grateful_2020',
		'THANKS': 'Thankful_Grateful_2020',
		'THX': 'Thankful_Grateful_2020',
		'THANKFUL': 'Thankful_Grateful_2020',
		// ---- GLOBAL PRIDE ----
		'東京レインボープライド': 'Pride_2020',
		'TRP2020': 'Pride_2020',
		'好きだから好き': 'Pride_2020',
		'PRIDE': 'Pride_2020',
		'PRIDE2020': 'Pride_2020',
		'GLOBALPRIDE': 'Pride_2020',
		'GLOBALPRIDE2020': 'Pride_2020',
		'LOVEISLOVE': 'Pride_2020',
		'常に誇りを': 'Pride_2020_AlwaysProud',
		'ALWAYSPROUD': 'Pride_2020_AlwaysProud',
		'PRIDEMONTH': 'Pride_2020_AlwaysProud',
		// ---- LGBT History Month ----
		'LGBTQIAHISTORYMONTH': 'LGBTQHistoryMonth_2021',
		'LGBTQIAHM2020': 'LGBTHistoryMonth_2020',
		'LGBTQIAHM2021': 'LGBTQHistoryMonth_2021',
		'LGBTQIAHM20': 'LGBTHistoryMonth_2020',
		'LGBTQIAHM21': 'LGBTQHistoryMonth_2021',
		'LGBTQIHISTORYMONTH': 'LGBTQHistoryMonth_2021',
		'LGBTQHISTORYMONTH': 'LGBTQHistoryMonth_2021',
		'LGBTQHM2020': 'LGBTHistoryMonth_2020',
		'LGBTQHM2021': 'LGBTQHistoryMonth_2021',
		'LGBTHISTORYMONTH': 'LGBTQHistoryMonth_2021',
		'LGBTHM2020': 'LGBTHistoryMonth_2020',
		'LGBTHM2021': 'LGBTQHistoryMonth_2021',
		'LGBTHM20': 'LGBTHistoryMonth_2020',
		'LGBTHM21': 'LGBTQHistoryMonth_2021',
		// ---- National Coming Out Day ----
		'COMINGOUTDAY': 'NationalComingOutDay_2020',
		'COMINGOUTDAY2020': 'NationalComingOutDay_2020',
		'NATIONALCOMINGOUTDAY': 'NationalComingOutDay_2020',
		'NATIONALCOMINGOUTDAY2020': 'NationalComingOutDay_2020',
		'COMINGOUT': 'NationalComingOutDay_2020',
		'MYCOMINGOUTSTORY': 'NationalComingOutDay_2020',
		// ---- 移民遺産月間 ----
		'海外移住ストーリー': 'MyImmigrantStory_2020',
		'国外移住ストーリー': 'MyImmigrantStory_2020',
		'MYIMMIGRANTSTORY': 'MyImmigrantStory_2020',
		// ---- PlayStationPS5 ----
		'PLAYSTATION5': 'PlayStationPS5_2020',
		'PS5': 'PlayStationPS5_2020',
		'PS5REVEAL': 'PlayStationPS5_2020_add',
		// ---- 世界難民の日 ----
		'世界難民の日': 'WorldRefugees2020',
		'WORLDREFUGEEDAY': 'WorldRefugees2020',
		'REFUGEEDAY': 'WorldRefugees2020',
		'WITHREFUGEES': 'WorldRefugees2020',
		// ---- https://twitter.com/TwitterJP/statuses/1289367947610267649 ----
		'花火': 'FireworksRelayJP_April_2021',
		'花火大会': 'FireworksRelayJP_April_2021',
		'花火打ち上げ': 'FireworksRelayJP_April_2021',
		'花火の音': 'FireworksRelayJP_April_2021',
		'花火どこ ': 'FireworksRelayJP_April_2021',
		'花火駅伝': 'FireworksRelayJP_April_2021',
		'HANABI': 'JP_FireworksDay_2020_BH',
		// ---- マスクをしよう ----
		'マスクをしよう': 'WearAMask_2020_2021_ext2',
		'WEARAMASK': 'WearAMask_2020_2021_ext2',
		// ---- BLM ----
		'BLACKLIVESMATTER': 'BlackHistoryMonth',
		'BLACKHISTORYMONTH': 'BlackHistoryMonth',
		'BHM' :'BlackHistoryMonth',
		'BLACKHISTORYMONTHUK': 'BlackHistoryMonthUK_BHMUK_2020',
		'BHMUK': 'BlackHistoryMonthUK_BHMUK_2020',
		// ---- Day Of The Girl ----
		'国際ガールズデー': 'DayOfTheGirl_2020',
		'DAYOFTHEGIRL': 'DayOfTheGirl_2020',
		// ---- Christmas ----
		'クリスマス': 'Christmas_2020',
		'CHRISTMAS': 'Christmas_2020',
		'ハッピークリスマス': 'Christmas_2020',
		'HAPPYCHRISTMAS': 'Christmas_2020',
		'メリークリスマス': 'Christmas_2020',
		'MERRYCHRISTMAS': 'Christmas_2020',
		// ---- 世界人権デー ----
		'世界人権デー': 'HumanRightsDay_2020',
		'人権デー': 'HumanRightsDay_2020',
		'人権': 'HumanRightsDay_2020',
		'HUMANRIGHTSDAY': 'HumanRightsDay_2020',
		'HUMANRIGHTS': 'HumanRightsDay_2020',
		'STANDUP4HUMANRIGHTS': 'HumanRightsDay_2020',
		// [Twitter上で2020年を共に過ごした皆さんへ](https://blog.twitter.com/ja_jp/topics/company/2020/thishappened-in-2020-ja.html)
		'今年のできごと2020': 'ThisHappened2020',
		'THISHAPPENED2020': 'ThisHappened2020',
		'THISHAPPENED': 'ThisHappened2020',
		// [Twitter上で #宇宙の初日の出 を迎えましょう](https://blog.twitter.com/ja_jp/topics/events/2020/twitter_space_sunrise_2021.html)
		'KIBO': 'SpaceSunrise_2020',
		'宇宙からあけおめ': 'SpaceSunrise_2020',
		'宇宙の初日の出': 'SpaceSunrise_2020',
		'スペースサンライズ': 'SpaceSunrise_2020',
		'SPACESUNRISE': 'SpaceSunrise_2020',
		// ---- SaferInternetDay ----
		'セーファーインターネットデー': 'SaferInternetDay_2021',
		'SAFERINTERNETDAY': 'SaferInternetDay_2021',
		'SID2021': 'SaferInternetDay_2021',
		// ---- 世界赤十字デー ----
		'世界赤十字デー': 'WorldRedCrossDay_May_2021',
		'REDCROSS': 'WorldRedCrossDay_May_2021',
		'REDCRESCENTDAY': 'WorldRedCrossDay_May_2021',
		'REDCROSSDAY': 'WorldRedCrossDay_May_2021',
		'WORLDREDCRESCENTDAY': 'WorldRedCrossDay_May_2021',
		'WORLDREDCROSSDAY': 'WorldRedCrossDay_May_2021',
		'REDCRESCENT': 'WorldRedCrossDay_May_2021_add2',
		// ---- 世界予防接種週間 ----
		'世界予防接種週間': 'WorldImmunizationWeek_April_2021',
		'世界予防接種週間2021': 'WorldImmunizationWeek_April_2021',
		'ワクチン効果あり': 'WorldImmunizationWeek_April_2021',
		'VACCINESWORK': 'WorldImmunizationWeek_April_2021',
		'WORLDIMMUNISATIONWEEK': 'WorldImmunizationWeek_April_2021',
		'WORLDIMMUNIZATIONWEEK': 'WorldImmunizationWeek_April_2021',
		'WORLDIMMUNIZATIONWEEK2021': 'WorldImmunizationWeek_April_2021',
		// ---- その他 ----
		'MYTWITTERANNIVERSARY': 'MyTwitterAnniversary',
		'LOVETWITTER': 'LoveTwitter',
		'METOO': 'MeToo_v3',
		'MSBUILD': 'MSBuild_2020',
		'APPLEEVENT': 'April_Event_2021',
		'WWDC20': 'WWDC_2020_V11',
		'GOOGLEIO': 'GoogleIO2021',
		'GOOGLEIO2021': 'GoogleIO2021',
		'IO2021': 'GoogleIO2021',
		'IO21': 'GoogleIO2021',
		'ANDROID12': 'GoogleIO2021',
		'夏はサボテンダー': 'DFF_OperaOmnia_2019_Emoji',
		'午後の紅茶': 'KIRIN_GT_2_Japan_2019_Emoji_V2',
		'午後ティー': 'KIRIN_GT_2_Japan_2019_Emoji_V2',
		'ロマサガRS': 'romasaga_rs_2019',
		'シノアリス': 'Sinoalice_June2019',
		'GAMEOFTHRONES': 'GameofThrones_S8_2018_v2',
		'とと姉ちゃん': 'NHKMorningDrama',
		'高校野球': 'JapanHighSchoolBaseballEmoji',
		'KHL': 'KHL_Season_Start',
		'КХЛ': 'KHL_Season_Start'
	};

	Array.prototype.forEach.call(el.querySelectorAll('.status > .hashtag, .udesc > .hashtag'), function(elHashtag) {
		var index = elHashtag.innerHTML.replace(/^[#＃]/, '').toUpperCase();
		if (countryFlags[index]) {
			elHashtag.innerHTML += makeHTMLFromAlpha2(countryFlags[index][1]);
		} else if (organization[index]) {
			elHashtag.innerHTML += makeHTMLFromIconName(organization[index]);
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
