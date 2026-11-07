const districts = [
  ['India', 'Konkan & Deccan', 'Mumbai|Pune|Nashik|Nagpur'],
  ['India', 'Desert cities', 'Jaipur|Jodhpur|Udaipur|Bikaner'],
  ['India', 'Northern plains', 'Delhi|Agra|Lucknow|Varanasi'],
  ['India', 'Eastern crossing', 'Kolkata|Patna|Bhubaneswar|Guwahati'],
  ['India', 'Southern capitals', 'Bengaluru|Chennai|Hyderabad|Thiruvananthapuram'],
  ['India', 'Malabar & Tamil Nadu', 'Kochi|Kozhikode|Madurai|Coimbatore'],
  ['Pakistan', 'Indus ports', 'Karachi|Hyderabad (Sindh)|Thatta|Sukkur'],
  ['Pakistan', 'Punjab markets', 'Lahore|Faisalabad|Gujranwala|Sialkot'],
  ['Pakistan', 'Northern gateways', 'Islamabad|Rawalpindi|Peshawar|Abbottabad'],
  ['Pakistan', 'Western routes', 'Quetta|Gwadar|Turbat|Khuzdar'],
  ['Pakistan', 'River cities', 'Multan|Bahawalpur|Rahim Yar Khan|Dera Ghazi Khan'],
  ['Albania', 'Adriatic coast', 'Durrës|Vlorë|Lezhë|Shëngjin'],
  ['Albania', 'Central Albania', 'Tirana|Elbasan|Krujë|Kavajë'],
  ['Albania', 'Southern highlands', 'Berat|Gjirokastër|Korçë|Përmet'],
  ['Albania', 'Lakes & mountains', 'Shkodër|Pogradec|Kukës|Peshkopi'],
  ['Greece', 'Aegean connection', 'Athens|Thessaloniki|Volos|Kavala'],
];
const countryFlags = { India:'🇮🇳', Pakistan:'🇵🇰', Albania:'🇦🇱', Greece:'🇬🇷' };
export const atlasMap = {name:'Adriatic–Indus Express', size:80};
export function atlasBoard() {
  const cities = districts.flatMap(([country,district,names],group) =>
    names.split('|').map((name,index) => {
      const price = 80 + group * 15 + index * 5;
      const rent = 5 + group * 2 + index;
      return {name,country,district,group,type:'property',flag:countryFlags[country],price,rent,
        buildCost:50 * (1 + Math.floor(group / 4)), rents:[1,3,8,15,25,40].map(x=>x*rent)};
    }));
  const corners = [['START','go'],['In Prison','jail'],['Vacation','park'],['Go to prison','gojail']];
  const airports = ['Mumbai Airport','Lahore Airport','Karachi Airport','Tirana Airport'];
  const stops = [['Water Company','utility'],['Transit tax','tax'],['Power Company','utility'],['Harbor tax','tax']];
  let city = 0;
  return Array.from({length:80}, (_, id) => {
    const side = Math.floor(id / 20);
    const offset = id % 20;
    let special;
    if (offset === 0) special = corners[side];
    if (offset === 5) special = [side % 2 ? 'Surprise' : 'Treasure','event'];
    if (offset === 10) special = [airports[side],'station'];
    if (offset === 15) special = stops[side];
    if (!special) return {id,...cities[city++]};
    const [name,type] = special;
    return {id,name,type,group:-1,price:type==='station'?200:type==='utility'?150:0,rent:25};
  });
}
export function awardPassport(game) {
  const board = atlasBoard();
  for (const player of game.players) {
    if (player.out || player.passport) continue;
    const countries = new Set(board.filter(tile=>game.properties[tile.id]?.owner===player.id).map(tile=>tile.country));
    if (['India','Pakistan','Albania'].every(country=>countries.has(country))) {
      player.passport = true;
      player.cash += 200;
      game.log.unshift(player.name + ' completed the three-country passport and earned $200.');
    }
  }
}
