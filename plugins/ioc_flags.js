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
emojiStyle.innerHTML = 'img.emoji { margin: 0 0.3em; width: 1em; }';
document.getElementsByTagName('head')[0].appendChild(emojiStyle);

registerPlugin({
	newMessageElement: function(el) {
		// IOC: [ ISO-3166-1 Alpha-3, ISO-3166-1 Alpha-2, Unicode, ...], // Country Name
		var countryFlags = {
			//     [       'AC', 0x1F1E6, 0x1F1E8], //
			//     [       'CP', 0x1F1E8, 0x1F1F5], //
			//     [       'DG', 0x1F1E9, 0x1F1EC], //
			//     [       'EA', 0x1F1EA, 0x1F1E6], //
			//     [       'EU', 0x1F1EA, 0x1F1FA], //
			//     [       'IC', 0x1F1EE, 0x1F1E8], //
			//     [       'TA', 0x1F1F9, 0x1F1E6], //
			'AFG': ['AFG', 'AF', 0x1F1E6, 0x1F1EB], // Afghanistan
			//     ['AIA', 'AI', 0x1F1E6, 0x1F1EE], // Anguilla
			//     ['ALA', 'AX', 0x1F1E6, 0x1F1FD], // Åland Islands
			'ALB': ['ALB', 'AL', 0x1F1E6, 0x1F1F1], // Albania
			'ALG': ['DZA', 'DZ', 0x1F1E9, 0x1F1FF], // Algeria
			'AND': ['AND', 'AD', 0x1F1E6, 0x1F1E9], // Andorra
			'ANG': ['AGO', 'AO', 0x1F1E6, 0x1F1F4], // Angola
			'ANT': ['ATG', 'AG', 0x1F1E6, 0x1F1EC], // Antigua and Barbuda
			'ARG': ['ARG', 'AR', 0x1F1E6, 0x1F1F7], // Argentina
			'ARM': ['ARM', 'AM', 0x1F1E6, 0x1F1F2], // Armenia
			'ARU': ['ABW', 'AW', 0x1F1E6, 0x1F1FC], // Aruba
			'ASA': ['ASM', 'AS', 0x1F1E6, 0x1F1F8], // American Samoa
			//     ['ATA', 'AQ', 0x1F1E6, 0x1F1F6], // Antarctica
			//     ['ATF', 'TF', 0x1F1F9, 0x1F1EB], // French Southern Territories
			'AUS': ['AUS', 'AU', 0x1F1E6, 0x1F1FA], // Australia
			'AUT': ['AUT', 'AT', 0x1F1E6, 0x1F1F9], // Austria
			'AZE': ['AZE', 'AZ', 0x1F1E6, 0x1F1FF], // Azerbaijan
			'BAH': ['BHS', 'BS', 0x1F1E7, 0x1F1F8], // Bahamas
			'BAN': ['BGD', 'BD', 0x1F1E7, 0x1F1E9], // Bangladesh
			'BAR': ['BRB', 'BB', 0x1F1E7, 0x1F1E7], // Barbados
			'BDI': ['BDI', 'BI', 0x1F1E7, 0x1F1EE], // Burundi
			'BEL': ['BEL', 'BE', 0x1F1E7, 0x1F1EA], // Belgium
			'BEN': ['BEN', 'BJ', 0x1F1E7, 0x1F1EF], // Benin
			'BER': ['BMU', 'BM', 0x1F1E7, 0x1F1F2], // Bermuda
			//     ['BES', 'BQ', 0x1F1E7, 0x1F1F6], // Bonaire, Saint Eustatius and Saba
			//     ['BHR', 'BH', 0x1F1E7, 0x1F1ED], // Bahrain
			'BHU': ['BTN', 'BT', 0x1F1E7, 0x1F1F9], // Bhutan
			'BIH': ['BIH', 'BA', 0x1F1E7, 0x1F1E6], // Bosnia and Herzegovina
			'BIZ': ['BLM', 'BL', 0x1F1E7, 0x1F1F1], // Saint Barthélemy
			'BLR': ['BLR', 'BY', 0x1F1E7, 0x1F1FE], // Belarus
			//     ['BLZ', 'BZ', 0x1F1E7, 0x1F1FF], // Belize
			'BOL': ['BOL', 'BO', 0x1F1E7, 0x1F1F4], // Bolivia, Plurinational State of
			'BOT': ['BWA', 'BW', 0x1F1E7, 0x1F1FC], // Botswana
			'BRA': ['BRA', 'BR', 0x1F1E7, 0x1F1F7], // Brazil
			'BRN': ['BHR', 'BH', 0x1F1E7, 0x1F1ED], // Bahrain
			'BRU': ['BRN', 'BN', 0x1F1E7, 0x1F1F3], // Brunei Darussalam
			'BUL': ['BGR', 'BG', 0x1F1E7, 0x1F1EC], // Bulgaria
			'BUR': ['BFA', 'BF', 0x1F1E7, 0x1F1EB], // Burkina Faso
			//     ['BVT', 'BV', 0x1F1E7, 0x1F1FB], // Bouvet Island
			'CAF': ['CAF', 'CF', 0x1F1E8, 0x1F1EB], // Central African Republic
			'CAM': ['KHM', 'KH', 0x1F1F0, 0x1F1ED], // Cambodia
			'CAN': ['CAN', 'CA', 0x1F1E8, 0x1F1E6], // Canada
			'CAY': ['CYM', 'KY', 0x1F1F0, 0x1F1FE], // Cayman Islands
			//     ['CCK', 'CC', 0x1F1E8, 0x1F1E8], // Cocos (Keeling) Islands
			'CGO': ['COG', 'CG', 0x1F1E8, 0x1F1EC], // Congo
			'CHA': ['TCD', 'TD', 0x1F1F9, 0x1F1E9], // Chad
			'CHI': ['CHL', 'CL', 0x1F1E8, 0x1F1F1], // Chile
			'CHN': ['CHN', 'CN', 0x1F1E8, 0x1F1F3], // China
			'CIV': ['CIV', 'CI', 0x1F1E8, 0x1F1EE], // Côte d'Ivoire
			'CMR': ['CMR', 'CM', 0x1F1E8, 0x1F1F2], // Cameroon
			'COD': ['COD', 'CD', 0x1F1E8, 0x1F1E9], // Congo, the Democratic Republic of the
			'COK': ['COK', 'CK', 0x1F1E8, 0x1F1F0], // Cook Islands
			'COL': ['COL', 'CO', 0x1F1E8, 0x1F1F4], // Colombia
			'COM': ['COM', 'KM', 0x1F1F0, 0x1F1F2], // Comoros
			'CPV': ['CPV', 'CV', 0x1F1E8, 0x1F1FB], // Cape Verde
			'CRC': ['CRI', 'CR', 0x1F1E8, 0x1F1F7], // Costa Rica
			'CRO': ['HRV', 'HR', 0x1F1ED, 0x1F1F7], // Croatia
			'CUB': ['CUB', 'CU', 0x1F1E8, 0x1F1FA], // Cuba
			//     ['CUW', 'CW', 0x1F1E8, 0x1F1FC], // Curaçao
			//     ['CXR', 'CX', 0x1F1E8, 0x1F1FD], // Christmas Island
			'CYP': ['CYP', 'CY', 0x1F1E8, 0x1F1FE], // Cyprus
			'CZE': ['CZE', 'CZ', 0x1F1E8, 0x1F1FF], // Czech Republic
			'DEN': ['DNK', 'DK', 0x1F1E9, 0x1F1F0], // Denmark
			'DJI': ['DJI', 'DJ', 0x1F1E9, 0x1F1EF], // Djibouti
			'DMA': ['DMA', 'DM', 0x1F1E9, 0x1F1F2], // Dominica
			'DOM': ['DOM', 'DO', 0x1F1E9, 0x1F1F4], // Dominican Republic
			'ECU': ['ECU', 'EC', 0x1F1EB, 0x1F1E8], // Ecuador
			'EGY': ['EGY', 'EG', 0x1F1EA, 0x1F1EC], // Egypt
			'ERI': ['ERI', 'ER', 0x1F1EA, 0x1F1F7], // Eritrea
			'ESA': ['SLV', 'SV', 0x1F1F8, 0x1F1FB], // El Salvador
			//     ['ESH', 'EH', 0x1F1EA, 0x1F1ED], // Western Sahara
			'ESP': ['ESP', 'ES', 0x1F1EA, 0x1F1F8], // Spain
			'EST': ['EST', 'EE', 0x1F1EA, 0x1F1EA], // Estonia
			'ETH': ['ETH', 'ET', 0x1F1EA, 0x1F1F9], // Ethiopia
			'FIJ': ['FJI', 'FJ', 0x1F1EB, 0x1F1EF], // Fiji
			'FIN': ['FIN', 'FI', 0x1F1EB, 0x1F1EE], // Finland
			//     ['FLK', 'FK', 0x1F1EB, 0x1F1F0], // Falkland Islands (Malvinas)
			'FRA': ['FRA', 'FR', 0x1F1EB, 0x1F1F7], // France
			//     ['FRO', 'FO', 0x1F1EB, 0x1F1F4], // Faroe Islands
			'FSM': ['FSM', 'FM', 0x1F1EB, 0x1F1F2], // Micronesia, Federated States of
			'GAB': ['GAB', 'GA', 0x1F1EC, 0x1F1E6], // Gabon
			'GAM': ['GMB', 'GM', 0x1F1EC, 0x1F1F2], // Gambia
			'GBR': ['GBR', 'GB', 0x1F1EC, 0x1F1E7], // United Kingdom
			'GBS': ['GNB', 'GW', 0x1F1EC, 0x1F1FC], // Guinea-Bissau
			'GEO': ['GEO', 'GE', 0x1F1EC, 0x1F1EA], // Georgia
			'GEQ': ['GNQ', 'GQ', 0x1F1EC, 0x1F1F6], // Equatorial Guinea
			'GER': ['DEU', 'DE', 0x1F1E9, 0x1F1EA], // Germany
			//     ['GGY', 'GG', 0x1F1EC, 0x1F1EC], // Guernsey
			'GHA': ['GHA', 'GH', 0x1F1EC, 0x1F1ED], // Ghana
			//     ['GIB', 'GI', 0x1F1EC, 0x1F1EE], // Gibraltar
			//     ['GLP', 'GP', 0x1F1EC, 0x1F1F5], // Guadeloupe
			//     ['GNQ', 'GQ', 0x1F1EC, 0x1F1F6], // Equatorial Guinea
			'GRE': ['GRC', 'GR', 0x1F1EC, 0x1F1F7], // Greece
			//     ['GRL', 'GL', 0x1F1EC, 0x1F1F1], // Greenland
			'GRN': ['GRD', 'GD', 0x1F1EC, 0x1F1E9], // Grenada
			'GUA': ['GTM', 'GT', 0x1F1EC, 0x1F1F9], // Guatemala
			//     ['GUF', 'GF', 0x1F1EC, 0x1F1EB], // French Guiana
			'GUI': ['GIN', 'GN', 0x1F1EC, 0x1F1F3], // Guinea
			'GUM': ['GUM', 'GU', 0x1F1EC, 0x1F1FA], // Guam
			'GUY': ['GUY', 'GY', 0x1F1EC, 0x1F1FE], // Guyana
			'HAI': ['HTI', 'HT', 0x1F1ED, 0x1F1F9], // Haiti
			'HKG': ['HKG', 'HK', 0x1F1ED, 0x1F1F0], // Hong Kong
			//     ['HMD', 'HM', 0x1F1ED, 0x1F1F2], // Heard Island and McDonald Islands
			'HON': ['HND', 'HN', 0x1F1ED, 0x1F1F3], // Honduras
			'HUN': ['HUN', 'HU', 0x1F1ED, 0x1F1FA], // Hungary
			//     ['IMN', 'IM', 0x1F1EE, 0x1F1F2], // Isle of Man
			'INA': ['IDN', 'ID', 0x1F1EE, 0x1F1E9], // Indonesia
			'IND': ['IND', 'IN', 0x1F1EE, 0x1F1F3], // India
			//     ['IOT', 'IO', 0x1F1EE, 0x1F1F4], // British Indian Ocean Territory
			'IRI': ['IRN', 'IR', 0x1F1EE, 0x1F1F7], // Iran, Islamic Republic of
			'IRL': ['IRL', 'IE', 0x1F1EE, 0x1F1EA], // Ireland
			'IRQ': ['IRQ', 'IQ', 0x1F1EE, 0x1F1F6], // Iraq
			'ISL': ['ISL', 'IS', 0x1F1EE, 0x1F1F8], // Iceland
			'ISR': ['ISR', 'IL', 0x1F1EE, 0x1F1F1], // Israel
			'ISV': ['VIR', 'VI', 0x1F1FB, 0x1F1EE], // Virgin Islands, U.S.
			'ITA': ['ITA', 'IT', 0x1F1EE, 0x1F1F9], // Italy
			'IVB': ['VGB', 'VG', 0x1F1FB, 0x1F1EC], // Virgin Islands, British
			'JAM': ['JAM', 'JM', 0x1F1EF, 0x1F1F2], // Jamaica
			//     ['JEY', 'JE', 0x1F1EF, 0x1F1EA], // Jersey
			'JOR': ['JOR', 'JO', 0x1F1EF, 0x1F1F4], // Jordan
			'JPN': ['JPN', 'JP', 0x1F1EF, 0x1F1F5], // Japan
			'KAZ': ['KAZ', 'KZ', 0x1F1F0, 0x1F1FF], // Kazakhstan
			'KEN': ['KEN', 'KE', 0x1F1F0, 0x1F1EA], // Kenya
			'KGZ': ['KGZ', 'KG', 0x1F1F0, 0x1F1EC], // Kyrgyzstan
			'KIR': ['KIR', 'KI', 0x1F1F0, 0x1F1EE], // Kiribati
			'KOR': ['KOR', 'KR', 0x1F1F0, 0x1F1F7], // Korea, Republic of
			'KOS': ['   ', 'XK', 0x1F1FD, 0x1F1F0], // Kosovo
			'KSA': ['SAU', 'SA', 0x1F1F8, 0x1F1E6], // Saudi Arabia
			'KUW': ['KWT', 'KW', 0x1F1F0, 0x1F1FC], // Kuwait
			'LAO': ['LAO', 'LA', 0x1F1F1, 0x1F1E6], // Lao People's Democratic Republic
			'LAT': ['LVA', 'LV', 0x1F1F1, 0x1F1FB], // Latvia
			'LBA': ['LBY', 'LY', 0x1F1F1, 0x1F1FE], // Libya
			'LBR': ['LBR', 'LR', 0x1F1F1, 0x1F1F7], // Liberia
			'LCA': ['LCA', 'LC', 0x1F1F1, 0x1F1E8], // Saint Lucia
			'LES': ['LSO', 'LS', 0x1F1F2, 0x1F1F8], // Lesotho
			'LIB': ['LBN', 'LB', 0x1F1F1, 0x1F1E7], // Lebanon
			'LIE': ['LIE', 'LI', 0x1F1F1, 0x1F1EE], // Liechtenstein
			'LTU': ['LTU', 'LT', 0x1F1F1, 0x1F1F9], // Lithuania
			'LUX': ['LUX', 'LU', 0x1F1F1, 0x1F1FA], // Luxembourg
			//     ['MAC', 'MO', 0x1F1F2, 0x1F1F4], // Macao
			'MAD': ['MDG', 'MG', 0x1F1F2, 0x1F1EC], // Madagascar
			//     ['MAF', 'MF', 0x1F1F2, 0x1F1EB], // Saint Martin (French part)
			'MAR': ['MAR', 'MA', 0x1F1F2, 0x1F1E6], // Morocco
			'MAS': ['MYS', 'MY', 0x1F1F2, 0x1F1FE], // Malaysia
			'MAW': ['MWI', 'MW', 0x1F1F2, 0x1F1FC], // Malawi
			'MDA': ['MDA', 'MD', 0x1F1F2, 0x1F1E9], // Moldova, Republic of
			'MDV': ['MDV', 'MV', 0x1F1F2, 0x1F1FB], // Maldives
			'MEX': ['MEX', 'MX', 0x1F1F2, 0x1F1FD], // Mexico
			'MGL': ['MNG', 'MN', 0x1F1F2, 0x1F1F3], // Mongolia
			'MHL': ['MHL', 'MH', 0x1F1F2, 0x1F1ED], // Marshall Islands
			'MKD': ['MKD', 'MK', 0x1F1F2, 0x1F1F0], // Macedonia, the former Yugoslav Republic of
			'MLI': ['MLI', 'ML', 0x1F1F2, 0x1F1F1], // Mali
			'MLT': ['MLT', 'MT', 0x1F1F2, 0x1F1F9], // Malta
			'MNE': ['MNE', 'ME', 0x1F1F2, 0x1F1EA], // Montenegro
			//     ['MNP', 'MP', 0x1F1F2, 0x1F1F5], // Northern Mariana Islands
			'MON': ['MCO', 'MC', 0x1F1F2, 0x1F1E8], // Monaco
			'MOZ': ['MOZ', 'MZ', 0x1F1F2, 0x1F1FF], // Mozambique
			'MRI': ['MUS', 'MU', 0x1F1F2, 0x1F1FA], // Mauritius
			//     ['MSR', 'MS', 0x1F1F2, 0x1F1F8], // Montserrat
			'MTN': ['MRT', 'MR', 0x1F1F2, 0x1F1F7], // Mauritania
			//     ['MTQ', 'MQ', 0x1F1F2, 0x1F1F6], // Martinique
			'MYA': ['MMR', 'MM', 0x1F1F2, 0x1F1F2], // Myanmar
			//     ['MYT', 'YT', 0x1F1FE, 0x1F1F9], // Mayotte
			'NAM': ['NAM', 'NA', 0x1F1F3, 0x1F1E6], // Namibia
			'NCA': ['NIC', 'NI', 0x1F1F3, 0x1F1EE], // Nicaragua
			//     ['NCL', 'NC', 0x1F1F3, 0x1F1E8], // New Caledonia
			'NED': ['NLD', 'NL', 0x1F1F3, 0x1F1F1], // Netherlands
			'NEP': ['NPL', 'NP', 0x1F1F3, 0x1F1F5], // Nepal
			//     ['NFK', 'NF', 0x1F1F3, 0x1F1EB], // Norfolk Island
			'NGR': ['NGA', 'NG', 0x1F1F3, 0x1F1EC], // Nigeria
			'NIG': ['NER', 'NE', 0x1F1F3, 0x1F1EA], // Niger
			//     ['NIU', 'NU', 0x1F1F3, 0x1F1FA], // Niue
			'NOR': ['NOR', 'NO', 0x1F1F3, 0x1F1F4], // Norway
			'NRU': ['NRU', 'NR', 0x1F1F3, 0x1F1F7], // Nauru
			'NZL': ['NZL', 'NZ', 0x1F1F3, 0x1F1FF], // New Zealand
			'OMA': ['OMN', 'OM', 0x1F1F4, 0x1F1F2], // Oman
			'PAK': ['PAK', 'PK', 0x1F1F5, 0x1F1F0], // Pakistan
			'PAN': ['PAN', 'PA', 0x1F1F5, 0x1F1E6], // Panama
			'PAR': ['PRY', 'PY', 0x1F1F5, 0x1F1FE], // Paraguay
			//     ['PCN', 'PN', 0x1F1F5, 0x1F1F3], // Pitcairn
			'PER': ['PER', 'PE', 0x1F1F5, 0x1F1EA], // Peru
			'PHI': ['PHL', 'PH', 0x1F1F5, 0x1F1ED], // Philippines
			'PLE': ['PSE', 'PS', 0x1F1F5, 0x1F1F8], // Palestinian Territory, Occupied
			'PLW': ['PLW', 'PW', 0x1F1F5, 0x1F1FC], // Palau
			'PNG': ['PNG', 'PG', 0x1F1F5, 0x1F1EC], // Papua New Guinea
			'POL': ['POL', 'PL', 0x1F1F5, 0x1F1F1], // Poland
			'POR': ['PRT', 'PT', 0x1F1F5, 0x1F1F9], // Portugal
			'PRK': ['PRK', 'KP', 0x1F1F0, 0x1F1F5], // Korea, Democratic People's Republic of
			'PUR': ['PRI', 'PR', 0x1F1F5, 0x1F1F7], // Puerto Rico
			//     ['PYF', 'PF', 0x1F1F5, 0x1F1EB], // French Polynesia
			'QAT': ['QAT', 'QA', 0x1F1F6, 0x1F1E6], // Qatar
			//     ['REU', 'RE', 0x1F1F7, 0x1F1EA], // Réunion
			'ROU': ['ROU', 'RO', 0x1F1F7, 0x1F1F4], // Romania
			'RSA': ['ZAF', 'ZA', 0x1F1FF, 0x1F1E6], // South Africa
			'RUS': ['RUS', 'RU', 0x1F1F7, 0x1F1FA], // Russian Federation
			'RWA': ['RWA', 'RW', 0x1F1F7, 0x1F1FC], // Rwanda
			'SAM': ['WSM', 'WS', 0x1F1FC, 0x1F1F8], // Samoa
			'SEN': ['SEN', 'SN', 0x1F1F8, 0x1F1F3], // Senegal
			'SEY': ['SYC', 'SC', 0x1F1F8, 0x1F1E8], // Seychelles
			//     ['SGS', 'GS', 0x1F1EC, 0x1F1F8], // South Georgia and the South Sandwich Islands
			//     ['SHN', 'SH', 0x1F1F8, 0x1F1ED], // Saint Helena, Ascension and Tristan da Cunha
			'SIN': ['SGP', 'SG', 0x1F1F8, 0x1F1EC], // Singapore
			//     ['SJM', 'SJ', 0x1F1F8, 0x1F1EF], // Svalbard and Jan Mayen
			'SKN': ['KNA', 'KN', 0x1F1F0, 0x1F1F3], // Saint Kitts and Nevis
			'SLE': ['SLE', 'SL', 0x1F1F8, 0x1F1F1], // Sierra Leone
			'SLO': ['SVN', 'SI', 0x1F1F8, 0x1F1EE], // Slovenia
			'SMR': ['SMR', 'SM', 0x1F1F8, 0x1F1F2], // San Marino
			'SOL': ['SLB', 'SB', 0x1F1F8, 0x1F1E7], // Solomon Islands
			'SOM': ['SOM', 'SO', 0x1F1F8, 0x1F1F4], // Somalia
			//     ['SPM', 'PM', 0x1F1F5, 0x1F1F2], // Saint Pierre and Miquelon
			'SRB': ['SRB', 'RS', 0x1F1F7, 0x1F1F8], // Serbia
			'SRI': ['LKA', 'LK', 0x1F1F1, 0x1F1F0], // Sri Lanka
			'SSD': ['SSD', 'SS', 0x1F1F8, 0x1F1F8], // South Sudan
			'STP': ['STP', 'ST', 0x1F1F8, 0x1F1F9], // Sao Tome and Principe
			'SUD': ['SDN', 'SD', 0x1F1F8, 0x1F1E9], // Sudan
			'SUI': ['CHE', 'CH', 0x1F1E8, 0x1F1ED], // Switzerland
			'SUR': ['SUR', 'SR', 0x1F1F8, 0x1F1F7], // Suriname
			'SVK': ['SVK', 'SK', 0x1F1F8, 0x1F1F0], // Slovakia
			'SWE': ['SWE', 'SE', 0x1F1F8, 0x1F1EA], // Sweden
			'SWZ': ['SWZ', 'SZ', 0x1F1F8, 0x1F1FF], // Swaziland
			//     ['SXM', 'SX', 0x1F1F8, 0x1F1FD], // Sint Maarten (Dutch part)
			'SYR': ['SYR', 'SY', 0x1F1F8, 0x1F1FE], // Syrian Arab Republic
			'TAN': ['TZA', 'TZ', 0x1F1F9, 0x1F1FF], // Tanzania, United Republic of
			//     ['TCA', 'TC', 0x1F1F9, 0x1F1E8], // Turks and Caicos Islands
			'TGA': ['TON', 'TO', 0x1F1F9, 0x1F1F4], // Tonga
			'THA': ['THA', 'TH', 0x1F1F9, 0x1F1ED], // Thailand
			'TJK': ['TJK', 'TJ', 0x1F1F9, 0x1F1EF], // Tajikistan
			//     ['TKL', 'TK', 0x1F1F9, 0x1F1F0], // Tokelau
			'TKM': ['TKM', 'TM', 0x1F1F9, 0x1F1F2], // Turkmenistan
			'TLS': ['TLS', 'TL', 0x1F1F9, 0x1F1F1], // Timor-Leste
			'TOG': ['TGO', 'TG', 0x1F1F9, 0x1F1EC], // Togo
			//     ['TWN', 'TW', 0x1F1F9, 0x1F1FC], // Taiwan, Province of China
			'TTO': ['TTO', 'TT', 0x1F1F9, 0x1F1F9], // Trinidad and Tobago
			'TUN': ['TUN', 'TN', 0x1F1F9, 0x1F1F3], // Tunisia
			'TUR': ['TUR', 'TR', 0x1F1F9, 0x1F1F7], // Turkey
			'TUV': ['TUV', 'TV', 0x1F1F9, 0x1F1FB], // Tuvalu
			'UAE': ['ARE', 'AE', 0x1F1E6, 0x1F1EA], // United Arab Emirates
			'UGA': ['UGA', 'UG', 0x1F1FA, 0x1F1EC], // Uganda
			'UKR': ['UKR', 'UA', 0x1F1FA, 0x1F1E6], // Ukraine
			//     ['UMI', 'UM', 0x1F1FA, 0x1F1F2], // United States Minor Outlying Islands
			'URU': ['URY', 'UY', 0x1F1FA, 0x1F1FE], // Uruguay
			'USA': ['USA', 'US', 0x1F1FA, 0x1F1F8], // United States
			'UZB': ['UZB', 'UZ', 0x1F1FA, 0x1F1FF], // Uzbekistan
			'VAN': ['VUT', 'VU', 0x1F1FB, 0x1F1FA], // Vanuatu
			//     ['VAT', 'VA', 0x1F1FB, 0x1F1E6], // Holy See (Vatican City State)
			'VEN': ['VEN', 'VE', 0x1F1FB, 0x1F1EA], // Venezuela, Bolivarian Republic of
			'VIE': ['VNM', 'VN', 0x1F1FB, 0x1F1F3], // Viet Nam
			'VIN': ['VCT', 'VC', 0x1F1FB, 0x1F1E8], // Saint Vincent and the Grenadines
			//     ['WLF', 'WF', 0x1F1FC, 0x1F1EB], // Wallis and Futuna
			'YEM': ['YEM', 'YE', 0x1F1FE, 0x1F1EA], // Yemen
			'ZAM': ['ZMB', 'ZM', 0x1F1FF, 0x1F1F2], // Zambia
			'ZIM': ['ZWE', 'ZW', 0x1F1FF, 0x1F1FC], // Zimbabwe
			// ---- other ----
			'GOLD': ['', '', 0x1F947], // First Place Medal
			'金メダル': ['', '', 0x1F947], // First Place Medal
			'SILVER': ['', '', 0x1F948], // Second Place Medal
			'銀メダル': ['', '', 0x1F948], // Second Place Medal
			'BRONZE': ['', '', 0x1F949], // Third Place Medal
			'銅メダル': ['', '', 0x1F949] // Third Place Medal
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
			// ---- 開催国 ----
			'RIORECORDS': 'flame_paralympics_2016',
			'RIO2016': 'Paralympics_Rio2016___final',
			'リオ2016': 'Rio2016',
			'ROADTORIO': 'Rio2016',
			'2018平昌': 'PyeongChang_WO_18',
			'PYEONGCHANG2018': 'PyeongChang_WO_18',
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
			'MEWTWO': 'WBPikachu_Mewtwo',
			'뮤츠': 'WBPikachu_Mewtwo',
			'超梦': 'WBPikachu_Mewtwo',
			'超夢': 'WBPikachu_Mewtwo',
			'МЬЮТУ': 'WBPikachu_Mewtwo',
			'DETECTIVEPIKACHU': 'WB_Pikachu_2018',
			// [3月27日は「#さくらの日」](https://blog.twitter.com/ja_jp/topics/events/2019/sakura_day2019.html)
			'さくらの日': 'CherryBlossom_Sakura_2019',
			'さくら': 'CherryBlossom_Sakura_2019',
			'花見': 'CherryBlossom_Sakura_2019',
			'はなみ': 'CherryBlossom_Sakura_2019',
			'お花見': 'CherryBlossom_Sakura_2019',
			'桜': 'CherryBlossom_Sakura_2019',
			'おはなみ': 'CherryBlossom_Sakura_2019',
			'SAKURA': 'CherryBlossom_Sakura_2019',
			'開花': 'CherryBlossom_Sakura_2019',
			'開花宣言': 'CherryBlossom_Sakura_2019',
			'咲いた': 'CherryBlossom_Sakura_2019',
			'さくらの日': 'CherryBlossom_Sakura_2019',
			'サクラ': 'CherryBlossom_Sakura_2019',
			'夜桜': 'CherryBlossom_Sakura_2019',
			'満開': 'CherryBlossom_Sakura_2019',
			'CHERRYBLOSSOM': 'CherryBlossom_Sakura_2019',
			'サクラサク': 'CherryBlossom_Sakura_2019',
			'木之本桜': 'CherryBlossom_Sakura_2019', // https://twitter.com/TwitterJP/status/1110195453327335424
			// [4月25日は「#世界ペンギンの日」](https://blog.twitter.com/ja_jp/topics/events/2019/Worldpenguinday.html)
			'世界ペンギンの日': 'WorldPenguinDay_2019',
			'WORLDPENGUINDAY': 'WorldPenguinDay_2019',
			// [「#こどもの日」と「#母の日」はTwitter上で家族へ感謝の気持ちや愛を伝えませんか？](https://blog.twitter.com/ja_jp/topics/events/2019/childrensday_mothersday.html)
			'こどもの日': 'ChildrensDay_2019',
			'子どもの日': 'ChildrensDay_2019',
			'親バカ部': 'ChildrensDay_2019',
			'母の日': '2019_MothersDay',
			'MOTHERSDAY': '2019_MothersDay',
			// [#平成を語ろうハロー令和](https://blog.twitter.com/ja_jp/topics/events/2019/Hello_Reiwa.html)
			// [Twitterで平成を振り返ろう](https://blog.twitter.com/ja_jp/topics/events/2019/letstalkHeisei_2019.html)
			'新元号を考えてみた': 'NewEra_2019',
			'平成を語ろう': 'NewEra_2019',
			'平成最後': 'Heisei_2018_v2',
			'令和': 'Reiwa_NewEra_2019',
			'令和元年': 'Reiwa_NewEra_2019',
			'ハロー令和': 'Reiwa_NewEra_2019',
			// [6月16日（日）「 #父の日 」にTwitterで #お父さんありがとう を伝えよう](https://blog.twitter.com/ja_jp/topics/events/2019/fathersday2019.html)
			'父の日': 'FathersDay_2019',
			'FATHERSDAY': 'FathersDay_2019',
			'お父さんありがとう': 'FathersDay_2019',
			// ---- 新海誠監督映画 ----
			'君の名は': 'YourNameMovie_2019',
			'YOURNAME': 'YourNameMovie_2019',
			'天気の子': 'Toho_Tenkinoko_2019',
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
			// ---- その他 ----
			'GAMEOFTHRONES': 'GameofThrones_S8_2018_v2',
			'とと姉ちゃん': 'NHKMorningDrama',
			'高校野球': 'JapanHighSchoolBaseballEmoji',
			'KHL': 'KHL_Season_Start',
			'КХЛ': 'KHL_Season_Start'
		};

		// status
		Array.prototype.forEach.call(el.querySelectorAll('.status > .hashtag'), function(elHashtag) {
			var hashtag = elHashtag.innerHTML.match(hashtag_pattern);
			if (!hashtag || hashtag.length < 2) return;

			var index = hashtag[2].toUpperCase();
			if (countryFlags[index]) {
				elHashtag.innerHTML += countryFlags[index].slice(2).map(function(s) {
					return twemoji.convert.fromCodePoint(s);
				}).join('');
				twemoji.parse(elHashtag);
			} else if (organization[index]) {
				elHashtag.innerHTML += getFlagImageHTML(organization[index]);
			}
		});

		function getFlagImageHTML(iconName) {
			return [
				'<img class="emoji" draggable="false" alt="" src="//abs.twimg.com/hashflags/',
				iconName,
				'/',
				iconName,
				'.png">'
			].join('');
		}
	}
});
