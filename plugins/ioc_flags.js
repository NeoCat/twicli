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
		'뮤츠': 'WBPikachu_Mewtwo',
		'超梦': 'WBPikachu_Mewtwo',
		'超夢': 'WBPikachu_Mewtwo',
		'МЬЮТУ': 'WBPikachu_Mewtwo',
		'DETECTIVEPIKACHU': 'WB_Pikachu_2018',
		'ポケモン映画': 'Pokemon_Mew_2019_Emoji',
		'ミュウ': 'Pokemon_Mew_2019_Emoji',
		'ミュウツーの逆襲': 'Pokemon_Mew_2019_Emoji',
		'ミュウツーの逆襲前夜祭': 'Pokemon_Mew_2019_Emoji',
		'すべてはここからはじまった': 'Pokemon_Mew_2019_Emoji',
		'GOSNAPSHOT': 'PokemonGoJP_GoSnapshot_2019',
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
		// ---- AmazonPrimeDay_2019 ----
		'プライムデー': 'AmazonPrimeDay_2019_Japan',
		'プライムセール': 'AmazonPrimeDay_2019_Japan',
		'アマゾン': 'AmazonPrimeDay_2019_Japan',
		'AMAZON': 'AmazonPrimeDay_2019',
		'PRIMEDAY': 'AmazonPrimeDay_2019',
		'PRIMEDAYAMAZON': 'AmazonHotSale2019',
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
		'TWITTERトレンド大賞': '2019TwitterTrendAward_Emoji_V2',
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
		// [Twitter、グローバルで自殺防止の取り組みを支援](https://blog.twitter.com/ja_jp/topics/company/2019/WSPD_2019.html)
		'WORLDSUICIDEPREVENTIONDAY': 'WorldSuicidePreventionDay_2020',
		'世界自殺予防デー': 'WorldSuicidePreventionDay_2020',
		'自殺予防週間': 'WorldSuicidePreventionDay_2020',
		'いのち支える': 'WorldSuicidePreventionDay_2020',
		'相談してみよう': 'WorldSuicidePreventionDay_2020',
		'弱音を吐こう': 'WorldSuicidePreventionDay_2020',
		'WSPD': 'WorldSuicidePreventionDay_2020',
		'WSPD2020': 'WorldSuicidePreventionDay_2020',
		'SUICIDEPREVENTION': 'WorldSuicidePreventionDay_2020',
		'10SEP': 'WorldSuicidePreventionDay_2020',
		'LIGHTACANDLE': 'WorldSuicidePreventionDay_2020',
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
		// ---- HALLOWEEN2019 ----
		'ハロウィン': 'Halloween2019_Emoji_GIF',
		'トリックオアトリート': 'Halloween2019_Emoji_GIF',
		'HALLOWEEN': 'Halloween2019_Emoji_GIF',
		'HALLOWEEN19': 'Halloween2019_Emoji_GIF',
		'HALLOWEEN2019': 'Halloween2019_Emoji_GIF',
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
		'あけおめ': 'NewYearCelebration_Japan2019_sunrise',
		'謹賀新年': 'NewYearCelebration_Japan2019_sunrise',
		'あけましておめでとう': 'NewYearCelebration_Japan2019_sunrise',
		'初詣': 'NewYearCelebration_Japan2019_temple',
		'富士': 'NewYearCelebration_Japan2019_mtfuji',
		'鷹': 'NewYearCelebration_Japan2019_hawk',
		'茄子': 'NewYearCelebration_Japan2019_eggplant',
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
		'あつまれどうぶつの森': 'AnimalCrossing_Nintendo_2020_NewArtwork',
		'どうぶつの森': 'AnimalCrossing_Nintendo_2020_NewArtwork',
		'ACNH': 'AnimalCrossing_Nintendo_2020_NewArtwork',
		'ANIMALCROSSING': 'AnimalCrossing_Nintendo_2020_NewArtwork',
		'ANIMALCROSSINGNEWHORIZONS': 'AnimalCrossing_Nintendo_2020_NewArtwork',
		'TOMNOOK': 'AnimalCrossing_Nintendo_2020_NewArtwork',
		// KIRINSoccerJapan_2020
		'キリチャレの日': 'KIRINSoccerJapan_2020',
		'届けてキリン': 'KIRINSoccerJapan_2020',
		'聖獣麒麟': 'KIRINSoccerJapan_2020',
		// ---- 国際女性デー ----
		'国際女性デー': 'IWD_2020',
		'IWD2020': 'IWD_2020',
		'INTERNATIONALWOMENSDAY': 'IWD_2020',
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
		'手を洗おう': 'WHO_SafeHands_2020',
		'手洗いチャレンジ': 'WHO_SafeHands_2020',
		'HANDWASHING': 'WHO_SafeHands_2020',
		'SAFEHANDS': 'WHO_SafeHands_2020',
		'HANDWASHCHALLENGE': 'WHO_SafeHands_2020',
		'HANDWASHINGCHALLENGE': 'WHO_SafeHands_2020',
		'WASHYOURHANDS': 'WHO_SafeHands_2020',
		'STAYHOME': 'StayHome_2020',
		'STAYATHOME': 'StayHome_2020',
		'STAYATHOMESAVELIVES': 'StayHome_2020',
		'STAYHOMECHALLENGE': 'StayHome_2020',
		'HEALTHYATHOME': 'StayHome_2020',
		'うちで過ごそう': 'StayHome_2020',
		'家で過ごそう': 'StayHome_2020',
		'家にいるだけで世界は救える': 'StayHome_2020',
		'WORLDHEALTHDAY': 'StayHome_2020_WorldHealthDay_add1',
		'世界保健デー': 'StayHome_2020_WorldHealthDay_add1',
		// ---- アースデー ----
		'アースデー': 'EarthDay_2019_fixed',
		'EARTHDAY': 'EarthDay_2019_fixed',
		'VOICEFORTHEPLANET': 'EarthDay_2020_add',
		'EARTHDAY2020': 'EarthDay_2020_add2',
		'TWITTERFORGOOD': 'TwitterForGood_2020',
		'TWITTERFORGOODDAY': 'TwitterForGood_2020',
		'TFGDAY': 'TwitterForGood_2020',
		'TFG': 'TwitterForGood_2020',
		'FRIDAYFORGOOD': 'TwitterForGood_2020',
		'環境の日': 'EarthDay_2020_ext_v2',
		'CLIMATEACTION': 'EarthDay_2020_ext_v2',
		'EARTHRISE': 'EarthDay_2020_ext_v2',
		'VOTEEARTH': 'EarthDay_2020_ext_v2',
		'世界環境デー': 'WorldEnvironmentDay_ForNature_2020',
		'WORLDENVIRONMENTDAY': 'WorldEnvironmentDay_ForNature_2020',
		'FORNATURE': 'WorldEnvironmentDay_ForNature_2020',
		// https://twitter.com/TwitterJP/statuses/1256109065106669569
		'世界報道自由デー': 'WorldPressFreedomDay_2020',
		'記者に感謝': 'WorldPressFreedomDay_2020',
		'報道の自由': 'WorldPressFreedomDay_2020',
		'THANKAJOURNALIST': 'WorldPressFreedomDay_2020',
		'WORLDPRESSFREEDOMDAY': 'WorldPressFreedomDay_2020',
		'WPFD2020': 'WorldPressFreedomDay_2020',
		'PRESSFREEDOM': 'WorldPressFreedomDay_2020',
		// ---- TogetherWeCan LetsTalk ----
		'一人で抱え込まないで': 'MHA_TogetherWeCan_LetsTalk_2020',
		'話すのも悪くない': 'MHA_TogetherWeCan_LetsTalk_2020',
		'RECOVERTOGETHER': 'MHA_TogetherWeCan_LetsTalk_2020',
		'TOGETHERWECAN': 'MHA_TogetherWeCan_LetsTalk_2020',
		'WECARE': 'MHA_TogetherWeCan_LetsTalk_2020',
		'LETSTALK': 'MHA_TogetherWeCan_LetsTalk_2020',
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
		'花火': 'JP_FireworksDay_2020_BH',
		'HANABI': 'JP_FireworksDay_2020_BH',
		// ---- その他 ----
		'MYTWITTERANNIVERSARY': 'MyTwitterAnniversary',
		'LOVETWITTER': 'LoveTwitter',
		'METOO': 'MeToo_v3',
		'BLACKLIVESMATTER': 'BlackHistoryMonth',
		'MSBUILD': 'MSBuild_2020',
		'APPLEEVENT': 'Wasabi_Emoji_2019',
		'WWDC20': 'WWDC_2020_V11',
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

	// status
	Array.prototype.forEach.call(el.querySelectorAll('.status > .hashtag, .udesc > .hashtag'), function(elHashtag) {
		var index = elHashtag.innerHTML.replace(/^[#＃]/, '').toUpperCase();
		if (countryFlags[index]) {
			elHashtag.innerHTML += countryFlags[index].slice(2).map(function(s) {
				return twemoji.convert.fromCodePoint(s);
			}).join('');
		} else if (organization[index]) {
			elHashtag.innerHTML += getFlagImageHTML(organization[index]);
		}
	});
	Array.prototype.forEach.call(el.querySelectorAll('.uname, .status, #profile > div'), function(unparse) {
		twemoji.parse(unparse, { folder: 'svg', ext: '.svg' });
	});

	function getFlagImageHTML(iconName) {
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
