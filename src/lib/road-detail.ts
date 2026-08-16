/**
 * Long-form content for the /road/[slug] pages.
 *
 * Deliberately NOT in stories.ts. That module is imported by the homepage
 * (`findStoryFor`) and therefore lands in the client bundle; the ~14,000 words
 * here would ship to every visitor for no runtime benefit. This module is
 * imported only from `road/[slug]/+page.server.ts`, so it is inlined into the
 * 22 prerendered HTML files at build time and never sent as JavaScript.
 *
 * House style follows stories.ts: British English, no em dashes, no Oxford
 * commas, no comma before "and". Latin place names wrapped in <em>.
 *
 * The `faq` entries are rendered as visible Q&A *and* as FAQPage structured
 * data, so every answer must stand alone as a truthful reply to its question.
 */

export type RoadFaq = { q: string; a: string };

export type RoadDetail = {
	/** Where the road actually went, station by station. */
	route: string;
	/** Which modern roads follow the line, and how closely. */
	modern: string;
	/** What survives, and where a visitor can stand on it. */
	seeing: string;
	faq: RoadFaq[];
};

export const ROAD_DETAIL: Record<string, RoadDetail> = {
	"watling-street": {
		route:
			"<p>The road began at <em>Rutupiae</em>, the invasion beachhead at Richborough, where a great four-way triumphal arch once marked the formal entrance to the province. From there it ran west to <em>Durovernum Cantiacorum</em> at Canterbury, then north-west through <em>Durobrivae</em> at Rochester, crossing the Medway, and on over Shooter's Hill into <em>Londinium</em>.</p><p>North of the Thames it resumed as the great diagonal of the province. It passed <em>Verulamium</em> at St Albans, <em>Durocobrivis</em> at Dunstable, <em>Lactodorum</em> at Towcester and reached <em>Venonis</em> at High Cross in Leicestershire, where it crossed the Fosse Way at a near-perfect right angle. Beyond that it ran through <em>Letocetum</em> at Wall in Staffordshire and finished at <em>Viroconium Cornoviorum</em> at Wroxeter, for a time the fourth largest town in Roman Britain.</p>",
		modern:
			"<p>Watling Street is the most completely surviving of all Britain's Roman roads. The A2 carries its line from Dover through Canterbury to London. In the capital the road is still legible in the street plan: Edgware Road running north-west from Marble Arch is Watling Street, and the name persists on signposts in Bexleyheath and Radlett.</p><p>North-west of London the A5 follows the Roman surveying so closely that for long stretches the modern carriageway sits within a few metres of the original line. The M1 was built to relieve it, not to replace it. Where the A5 runs dead straight for miles across Northamptonshire and Warwickshire, that is Roman work.</p>",
		seeing:
			"<p><em>Letocetum</em> at Wall, near Lichfield, is the best single stop: an English Heritage site with the excavated remains of a Roman bath house and mansio, sitting directly on the road. <em>Verulamium</em> park at St Albans has the town walls, a theatre and a hypocaust in situ.</p><p>For the road itself, the stretch of the A5 between Towcester and High Cross is the classic drive. At High Cross a battered eighteenth-century monument marks the crossing with the Fosse Way, traditionally called the centre of Roman Britain.</p>",
		faq: [
			{
				q: "Is the A5 a Roman road?",
				a: "Largely, yes. From London to Shrewsbury the A5 follows the line of Watling Street, in many places within a few metres of the original Roman surveying. The road was not built by the Romans in its present form, but the route it takes is theirs.",
			},
			{
				q: "Is the A2 a Roman road?",
				a: "Yes. The A2 between Dover and London follows the Kentish half of Watling Street, the road that carried traffic from the Channel ports to the provincial capital.",
			},
			{
				q: "Why is it called Watling Street?",
				a: "The name is Old English, not Latin. The Wæclingas were the people settled around St Albans, which the Anglo-Saxons called Wæclingaceaster. The road that passed through their territory became Wæclinga stræt, and the name later spread along its whole length.",
			},
			{
				q: "Where did Watling Street start and end?",
				a: "It ran from Rutupiae at Richborough on the Kent coast to Viroconium at Wroxeter in Shropshire, crossing Britain at close to its widest reach and passing through Londinium on the way.",
			},
		],
	},

	"ermine-street": {
		route:
			"<p>Ermine Street left <em>Londinium</em> at Bishopsgate and ran north through Hertfordshire, passing the small town at Braughing. It continued to <em>Durovigutum</em> at Godmanchester, crossed the Great Ouse, then ran on to <em>Durobrivae</em> at Water Newton near Peterborough, a pottery town whose kilns supplied much of the province.</p><p>North of there it drove up through Lincolnshire past Ancaster to <em>Lindum</em> at Lincoln, where the legionary fortress became a colony for retired soldiers. From Lincoln it continued dead north to the Humber at Winteringham. There was no bridge: traffic crossed by ferry to <em>Petuaria</em> at Brough, then took the road on to <em>Eboracum</em> at York.</p>",
		modern:
			"<p>The A10 north out of London runs close to the southern end. The A1198 between Royston and Godmanchester still carries the name Ermine Street on its signs. North of Lincoln the A15 runs along the Roman line for more than twenty kilometres without a meaningful bend, one of the straightest stretches of road in Britain.</p><p>The A1 is often described as following Ermine Street, and along parts of its length it does, but the Great North Road and the Roman road diverge repeatedly. The A1 is the descendant of the medieval route, which itself borrowed Roman engineering where it suited.</p>",
		seeing:
			"<p>Lincoln is the obvious destination. The Newport Arch at the top of Steep Hill is the only Roman gateway in Britain still standing over a road carrying traffic, and the traffic below it is on the line of Ermine Street.</p><p>For the road as a road, drive or cycle the A15 north from Lincoln toward the Humber. The horizon-to-horizon straightness across the flat Lincolnshire farmland gives a clearer sense of Roman surveying than any excavated site.</p>",
		faq: [
			{
				q: "Is the A1 a Roman road?",
				a: "Only in places. The A1 descends from the medieval Great North Road, which followed Ermine Street along some stretches and left it along others. The A15 north of Lincoln is a much truer survival of the Roman line.",
			},
			{
				q: "Why is it called Ermine Street?",
				a: "From Old English Earninga stræt, the road of the Earningas, a people settled around Arrington in Cambridgeshire. As with Watling Street the name belongs to the Anglo-Saxons who used the road, not to the Romans who built it.",
			},
			{
				q: "How did Ermine Street cross the Humber?",
				a: "By ferry. The Roman road ran to the south bank at Winteringham and resumed on the north bank at Petuaria at Brough. No bridge crossed the Humber until 1981.",
			},
		],
	},

	"fosse-way": {
		route:
			"<p>The Fosse Way ran from <em>Isca Dumnoniorum</em> at Exeter north-east across the whole width of southern Britain. It passed <em>Lindinis</em> at Ilchester, skirted <em>Aquae Sulis</em> at Bath, and reached <em>Corinium Dobunnorum</em> at Cirencester, the second largest town in the province.</p><p>From Cirencester it ran on through the Cotswolds past Moreton-in-Marsh to <em>Venonis</em> at High Cross, where it crossed Watling Street. It continued through <em>Ratae Corieltauvorum</em> at Leicester and past Newark to finish at <em>Lindum</em> at Lincoln.</p><p>Its straightness is the thing most often remarked on. Over its full length of about three hundred and eighty kilometres the road never strays more than about ten kilometres from a straight line drawn between its endpoints.</p>",
		modern:
			"<p>No single modern road carries the whole Fosse Way, which is part of its charm. The A37 and A367 follow it in Somerset, the A429 through the Cotswolds between Cirencester and Moreton-in-Marsh, and the A46 north of Leicester toward Newark and Lincoln.</p><p>Between those stretches the road survives as unclassified lanes, farm tracks and field boundaries. The A429 is the section most drivers notice: it runs straight and fast across the Cotswold plateau in a way that no medieval road ever does.</p>",
		seeing:
			"<p>The Cotswold stretch of the A429 is the easiest place to appreciate it from a car. For walking, the section across the fields near Radstock in Somerset preserves a clear <em>agger</em>, the raised embankment on which the road was built.</p><p><em>Corinium</em> at Cirencester has the Corinium Museum, whose mosaic collection is among the best in Britain, and the town's street grid still reflects the Roman one.</p>",
		faq: [
			{
				q: "Is the A46 the Fosse Way?",
				a: "Along parts of its length, yes. The A46 between Leicester and Lincoln follows the Fosse Way closely. Further south the Roman line is carried by the A429 through the Cotswolds and the A37 and A367 in Somerset.",
			},
			{
				q: "Was the Fosse Way a Roman frontier?",
				a: "Probably, for a short time. In the years immediately after the invasion of AD 43 it appears to have marked the western limit of Roman control, with forts strung along it. Later governors pushed the frontier into Wales and the north, and the road became an internal trunk route.",
			},
			{
				q: "Why is it called the Fosse Way?",
				a: "From the Latin fossa, meaning ditch. A defensive ditch is thought to have run alongside the road, at least along the stretch where it served as a frontier.",
			},
		],
	},

	"stane-street": {
		route:
			"<p>Stane Street ran south-west from <em>Londinium</em> to <em>Noviomagus Reginorum</em> at Chichester. It left London at the southern bridgehead in Southwark and headed for Ewell, then crossed the Mole near Dorking and climbed the chalk scarp of the North Downs close to Box Hill.</p><p>Beyond the Downs it ran through the heavy clay of the Sussex Weald, passed the posting station at Alfoldean, crossed the Arun, and climbed the South Downs at Bignor before dropping into the coastal plain and the civitas capital of the Regni.</p><p>The surveying is the boldest in Britain. The first stretch out of London is aligned almost exactly on the centre of Chichester, ninety kilometres away and entirely out of sight beyond two ranges of hills.</p>",
		modern:
			"<p>The A29 through Sussex follows long sections, particularly between Billingshurst and Pulborough. In Surrey the A24 shadows the line near Dorking. Within London the road is largely built over, though Kennington Park Road and Clapham Road sit on it.</p><p>Much of the middle of the route was never adopted by a modern road at all, which is why so much of it survives as footpath and bridleway across the Weald and the Downs.</p>",
		seeing:
			"<p>Bignor Roman Villa sits beside the road on the south slope of the Downs, and its mosaics are among the finest in Britain. The climb of Bignor Hill immediately above it carries a well-preserved stretch of the road, now a chalk track through open downland.</p><p>The section over Eartham Wood, managed by the Forestry Commission, has an excavated <em>agger</em> with the original metalling exposed and interpreted.</p>",
		faq: [
			{
				q: "Is the A29 a Roman road?",
				a: "In parts. The A29 through West Sussex follows Stane Street along several long stretches, though the modern road leaves and rejoins the Roman line more than once.",
			},
			{
				q: "Why is it called Stane Street?",
				a: "Stane is simply the Old English word for stone. To Anglo-Saxon travellers a metalled Roman road was remarkable enough in a landscape of mud tracks that the surface became the name.",
			},
			{
				q: "Can you walk Stane Street?",
				a: "Yes. Substantial sections across the South Downs, particularly over Bignor Hill and through Eartham Wood, are public rights of way, and the National Trust and Forestry Commission maintain access to several of the best preserved stretches.",
			},
		],
	},

	"akeman-street": {
		route:
			"<p>Akeman Street ran west from <em>Verulamium</em> at St Albans, where it left Watling Street, and headed for the Chilterns. It passed through Tring and Aylesbury, then ran across the Oxfordshire clay past Alchester near Bicester, a small walled town at an important junction.</p><p>West of Alchester it continued past the villa at North Leigh and through the Windrush valley to reach <em>Corinium Dobunnorum</em> at Cirencester, where it met the Fosse Way. Watling Street, Akeman Street and the Fosse Way together enclosed the wealthiest and most Romanised part of the province.</p>",
		modern:
			"<p>The A41 picks up the line near Tring and follows it, on and off, toward Bicester. West of there the modern road network largely abandons it, and the Roman route survives as minor lanes and green tracks through west Oxfordshire and the Cotswolds.</p>",
		seeing:
			"<p>North Leigh Roman Villa in Oxfordshire sits just off the road and has a fine mosaic under cover. The green lane sections between Kirtlington and Ramsden are walkable and unusually undisturbed.</p><p>At Cirencester the Corinium Museum sets the road in the context of the town it served.</p>",
		faq: [
			{
				q: "Where does the name Akeman Street come from?",
				a: "It is Old English. The Anglo-Saxons called Bath Acemannesceaster, the town of Aceman, and Akeman Street was understood as the road leading toward it from the east.",
			},
			{
				q: "Is the A41 a Roman road?",
				a: "Along part of its length. Between Tring and the Bicester area the A41 follows Akeman Street reasonably closely, though the correspondence is looser than that of the A5 with Watling Street.",
			},
		],
	},

	"dere-street": {
		route:
			"<p>Dere Street ran north from <em>Eboracum</em> at York, the legionary fortress and later capital of Britannia Inferior. It passed <em>Isurium Brigantum</em> at Aldborough and <em>Cataractonium</em> at Catterick, crossed the Tees, and reached <em>Vinovia</em> at Binchester.</p><p>It continued north to <em>Coria</em> at Corbridge, the great supply base on the Tyne just south of Hadrian's Wall, and crossed the wall itself at the Portgate. Beyond the frontier it pushed on through Redesdale and over the Cheviots at Chew Green, then ran through the Scottish borders past Trimontium at Newstead to reach Inveresk on the Firth of Forth.</p>",
		modern:
			"<p>The A1 follows the line closely between York and Scotch Corner. North of Corbridge the A68 takes up the route across Northumberland and into Scotland, and its long straight climbs and sudden crests are a direct consequence of Roman surveying that took hills head on rather than contouring around them.</p>",
		seeing:
			"<p>Corbridge Roman Town is the best stop: the excavated site straddles the road, and the main street you walk down is Dere Street itself. Chew Green in the Cheviots preserves a remarkable set of Roman camp earthworks in wholly empty country, reached on foot.</p><p>The A68 north of Corbridge is the drive. Its switchback profile is the single clearest demonstration in Britain of how Roman roads treated terrain.</p>",
		faq: [
			{
				q: "Is the A68 a Roman road?",
				a: "Substantially, yes. The A68 between Corbridge and the Scottish border follows Dere Street, and its famously abrupt crests and dips come from the Roman preference for holding a straight alignment over hilly ground.",
			},
			{
				q: "How far north did Dere Street go?",
				a: "As far as Inveresk near Edinburgh, and it served the Antonine Wall during the twenty-odd years that frontier was held. After the Romans fell back to Hadrian's Wall it remained the main road to the northern frontier.",
			},
		],
	},

	"peddars-way": {
		route:
			"<p>Peddars Way ran from a junction with the Icknield Way in south-west Norfolk, near Knettishall Heath, north-west across the county to the coast at Holme-next-the-Sea. It holds a remarkably consistent alignment for about seventy kilometres over gently rolling chalk and sand.</p><p>Its purpose is generally read as military. The road was laid out in the years after the Boudican revolt of AD 60 and 61, cutting directly through the territory of the defeated Iceni, and it may have continued by ferry across the Wash to the Lincolnshire shore.</p>",
		modern:
			"<p>Almost none of it. Peddars Way is unusual among major Roman roads in Britain in having been left alone: no modern trunk road took it up, and long stretches were never even metalled. A few short sections are minor lanes; the rest is track and footpath.</p>",
		seeing:
			"<p>The whole route is a National Trail, the Peddars Way and Norfolk Coast Path. It is one of the easiest long Roman roads in Britain to walk in full, taking three or four days, sandy underfoot and almost level throughout.</p><p>The best single stretch is across the heath and forest between Castle Acre and Fring, where the road runs arrow-straight through open country with no modern intrusion at all.</p>",
		faq: [
			{
				q: "Can you walk the whole of Peddars Way?",
				a: "Yes. It is a designated National Trail running about seventy kilometres from Knettishall Heath to Holme-next-the-Sea, and it is among the best preserved Roman roads in Britain to walk from end to end.",
			},
			{
				q: "Why was Peddars Way built?",
				a: "Almost certainly to control the Iceni after their revolt under Boudica was crushed in AD 61. The road drives straight through their heartland, which is the behaviour of an army securing hostile territory rather than a trade route following demand.",
			},
		],
	},

	"via-devana": {
		route:
			"<p>The route as proposed runs diagonally across England from <em>Camulodunum</em> at Colchester through Cambridge and Godmanchester, then north-west through the Midlands to <em>Deva Victrix</em> at Chester.</p><p>Real Roman road certainly exists along parts of that line. The stretch from Colchester toward Cambridge is well attested, and the section from Cambridge to Godmanchester is clear on the ground. Beyond Godmanchester the evidence for a single continuous highway to Chester thins out sharply, and most modern archaeologists treat the western half as a chain of separate roads rather than one route.</p>",
		modern:
			"<p>The A604 and A1307 between Cambridge and Haverhill follow parts of the eastern section. Worts Causeway and Wort's Road in Cambridge sit on the Roman line, and the modern Via Devana road name appears in the city.</p>",
		seeing:
			"<p>The Gog Magog hills south-east of Cambridge carry a clear stretch as a chalk track with wide views. Godmanchester has a well-understood Roman town plan and the road's junction with Ermine Street.</p>",
		faq: [
			{
				q: "Did the Via Devana really exist?",
				a: "Not as a single named Roman highway. The name was coined in the eighteenth century by the Cambridge antiquary Charles Mason for a supposed route from Colchester to Chester. Roman roads exist along parts of that line, but the idea of one continuous road is a Georgian reconstruction rather than a Roman fact.",
			},
			{
				q: "What does Via Devana mean?",
				a: "The road to Deva. Deva Victrix was the Roman legionary fortress at Chester, and the name was invented to describe a road supposedly aimed at it.",
			},
		],
	},

	"sarn-helen": {
		route:
			"<p>Sarn Helen is not one road but the Welsh name given to the chain of Roman roads running the length of Wales from north to south. The northern end is at <em>Segontium</em>, the fort at Caernarfon. From there the line runs south-east past the fort at Tomen y Mur near Trawsfynydd, over the moors above Ffestiniog and down through mid Wales.</p><p>It continues past the gold mines at Dolaucothi, which the Roman state worked on a large scale, and reaches <em>Maridunum</em> at Carmarthen in the south-west. Several branches and alternative alignments carry the same name locally.</p>",
		modern:
			"<p>Very little. The A470 shadows the general corridor through mid Wales without following the Roman line closely. A handful of mountain lanes sit directly on it, and several are still signposted Sarn Helen.</p>",
		seeing:
			"<p>The moorland above Ffestiniog, between Tomen y Mur and Dolwyddelan, has the clearest surviving stretches, where the <em>agger</em> is plain as a raised band in the turf across empty ground.</p><p>Dolaucothi Gold Mines, now in the care of the National Trust, is the outstanding destination on the southern half: the only known Roman gold mine in Britain, with surviving aqueduct channels and adits.</p>",
		faq: [
			{
				q: "Who was Sarn Helen named after?",
				a: "Tradition names Elen Luyddog, Helen of the Hosts, the British wife of the usurper Magnus Maximus in the late fourth century, who was said to have ordered roads built to move her husband's armies. The story is medieval rather than Roman. Some scholars instead derive the name from the Welsh halen, meaning salt, or from y lleng, the legion.",
			},
			{
				q: "Can you walk Sarn Helen?",
				a: "Parts of it. There is no single continuous right of way along the whole chain, but long stretches across the uplands of Snowdonia and mid Wales are open access or public footpath and are well worth walking.",
			},
		],
	},

	stanegate: {
		route:
			"<p>The Stanegate ran between <em>Coria</em> at Corbridge on the Tyne and <em>Luguvalium</em> at Carlisle on the Eden, crossing the narrowest part of northern Britain. It followed the natural corridor of the Tyne and Irthing valleys rather than the ridge line that Hadrian's Wall would later take.</p><p>Forts were built along it under the Flavian emperors and then more densely under Trajan: Vindolanda, Nether Denton, Carvoran and others. For roughly a generation, from about AD 105 until the wall was begun around AD 122, this string of forts along a road was the northern frontier of the Roman empire in Britain.</p>",
		modern:
			"<p>The A69 between Corbridge and Carlisle runs along the same corridor and follows the Roman line closely in places, though it takes an easier course through the valley bottom where the Roman road held higher ground.</p><p>The minor road known as the Military Road, the B6318, is a different thing entirely and is largely eighteenth century, built on the wall rather than on the Stanegate.</p>",
		seeing:
			"<p>Vindolanda is the essential visit. The fort and its excavated civilian settlement sit directly on the Stanegate, and the site's waterlogged deposits produced the writing tablets that are the best surviving evidence of everyday Roman life anywhere in the empire.</p><p>The stretch of surviving road immediately outside the Vindolanda site is visible and walkable, with an original Roman milestone still standing in position beside it.</p>",
		faq: [
			{
				q: "Is the Stanegate older than Hadrian's Wall?",
				a: "Yes. The road and its forts were established under Trajan in the early second century, on the line of still earlier Flavian forts. Hadrian's Wall was begun around AD 122, a little to the north, and the Stanegate then became its supply road.",
			},
			{
				q: "Where can I see the Stanegate?",
				a: "At Vindolanda near Bardon Mill in Northumberland. A stretch of the Roman road survives beside the fort, complete with a milestone standing where the Romans put it.",
			},
		],
	},

	"king-street": {
		route:
			"<p>King Street branched from Ermine Street near <em>Durobrivae</em> at Water Newton and ran north through the western edge of the Lincolnshire fens, past Bourne and Sleaford, before rejoining the main road south of <em>Lindum</em> at Lincoln.</p><p>Where Ermine Street kept to the higher ground to the east, King Street took the lower and more direct line through the fen edge, which required building a raised causeway across ground that flooded. It served the salt-making and farming settlements of the fenland, a landscape the Romans drained and exploited intensively.</p>",
		modern:
			"<p>The B1180 and a series of minor roads between Bourne and Sleaford follow it. Several parish lanes in south Lincolnshire carry the name King Street directly, and the alignment is easy to pick out on a map as an unusually straight run of otherwise unremarkable country roads.</p>",
		seeing:
			"<p>The fen-edge lanes between Baston and Kate's Bridge give the clearest sense of it. This is quiet, flat country and the road's straightness across it is unmistakable.</p><p>Nearby, the Roman town at Water Newton and the Car Dyke, a major Roman watercourse running roughly parallel, put the road in the context of a heavily engineered fenland landscape.</p>",
		faq: [
			{
				q: "Why is it called King Street?",
				a: "The name is medieval and honorific rather than Roman. No Roman name for the road has come down to us. King Street simply marked it out as a major highway in a period when most roads belonged to no one in particular.",
			},
			{
				q: "How is King Street different from Ermine Street?",
				a: "They are parallel routes between roughly the same points. Ermine Street took the higher, drier ground to the east; King Street ran lower and straighter through the fen edge on a built causeway.",
			},
		],
	},

	"pye-road": {
		route:
			"<p>The Pye Road ran north from <em>Camulodunum</em> at Colchester, the first Roman colony in Britain, to <em>Venta Icenorum</em> at Caistor St Edmund, the civitas capital of the Iceni just south of modern Norwich.</p><p>It crossed the Stour near Stratford St Mary, ran up through Suffolk past the small town at Coddenham, crossed the Waveney at Scole where a substantial roadside settlement grew up, and continued over the Tas to Caistor. Its purpose was administrative: it tied the defeated Iceni to the colony that symbolised Roman power in the region.</p>",
		modern:
			"<p>The A140 between Ipswich and Norwich follows the Roman line closely for most of its length, which is why it runs so much straighter than the lanes around it. The A12 near Stratford St Mary picks up the southern end.</p>",
		seeing:
			"<p><em>Venta Icenorum</em> at Caistor St Edmund is the destination and it is an unusual one: the town was never built over, so the full circuit of its walls and the grid of its streets survive as earthworks in open fields, freely accessible.</p><p>Scole, where the road crossed the Waveney, produced one of the richest roadside settlement excavations in East Anglia.</p>",
		faq: [
			{
				q: "Is the A140 a Roman road?",
				a: "Yes, largely. The A140 between Ipswich and Norwich follows the line of the Pye Road, the Roman route between Colchester and Venta Icenorum.",
			},
			{
				q: "Where does the name Pye Road come from?",
				a: "It is medieval and its origin is disputed. The most common reading takes it from Old English pie, the magpie, though no one has satisfactorily explained why the bird should give a road its name.",
			},
		],
	},

	"devils-highway": {
		route:
			"<p>The Devil's Highway ran west from <em>Londinium</em> to <em>Calleva Atrebatum</em> at Silchester, the walled town that was the tribal capital of the Atrebates and a major road hub in its own right.</p><p>It crossed the Thames at <em>Pontes</em> near Staines, then ran across the Bagshot heaths and the sandy country of east Berkshire, through what is now Crowthorne and Wokingham, before approaching Silchester from the east. The line is direct and fast, chosen for speed across poor and thinly settled ground.</p>",
		modern:
			"<p>The A4 and the A30 both run in the same broad corridor without following the Roman line closely. Much of the road's central section crosses ground that was later heath, forest and army training land, so no modern route adopted it.</p>",
		seeing:
			"<p>Silchester is the destination and it is remarkable: the town was abandoned rather than built over, so the complete circuit of the Roman walls and the amphitheatre survive in open countryside, with a public footpath round the whole circuit.</p><p>For the road itself, the wooded stretches around Crowthorne and through Swinley Forest carry a clear <em>agger</em> along public paths.</p>",
		faq: [
			{
				q: "Why is it called the Devil's Highway?",
				a: "The name is medieval. Anglo-Saxon and later travellers who found a dead straight metalled road running across empty heath, built by no one they knew of, attributed it to the devil. The same instinct named the Devil's Causeway in Northumberland and the Devil's Dyke in Cambridgeshire.",
			},
			{
				q: "What was at the end of the road?",
				a: "Calleva Atrebatum at Silchester, a substantial walled Roman town and road junction. Unusually, it was abandoned after the Roman period rather than built over, so its walls and amphitheatre still stand in farmland.",
			},
		],
	},

	"ackling-dyke": {
		route:
			"<p>Ackling Dyke ran south-west from <em>Sorviodunum</em> at Old Sarum, just north of modern Salisbury, across Cranborne Chase to <em>Durnovaria</em> at Dorchester in Dorset.</p><p>It climbed onto the chalk downland and held to the high ground, passing close to the Iron Age hillfort at Badbury Rings and through a landscape already dense with Bronze Age barrows. The Roman engineers drove the road straight through that prehistoric cemetery, in places cutting into the barrows themselves.</p>",
		modern:
			"<p>The B3081 and various minor roads take up short sections, and the A354 between Salisbury and Blandford runs in the same corridor. But much of the best-preserved length crosses land that never carried a modern road, which is precisely why it survives so well.</p>",
		seeing:
			"<p>This is the finest surviving Roman road earthwork in Britain. Between Badbury Rings and Bottlebush Down the <em>agger</em> stands up to three metres above the surrounding fields, twelve metres wide, unmistakable and walkable for several kilometres.</p><p>The National Trust land around Badbury Rings gives the easiest access. Park at the rings and walk north-west along the road.</p>",
		faq: [
			{
				q: "What is an agger?",
				a: "The raised embankment on which a Roman road was built, formed from material dug out of the ditches either side. It lifted the running surface clear of standing water. Ackling Dyke has the most impressive surviving agger in Britain, standing up to three metres high.",
			},
			{
				q: "Where is the best place to walk Ackling Dyke?",
				a: "The stretch between Badbury Rings and Bottlebush Down in Dorset, where the road survives as a huge raised bank across open downland and is accessible on foot from the National Trust car park at Badbury Rings.",
			},
		],
	},

	"stone-street": {
		route:
			"<p>Stone Street ran almost due south from <em>Durovernum Cantiacorum</em> at Canterbury, the chief town of the Cantii, to <em>Portus Lemanis</em> at Lympne on the Kent coast.</p><p>Lympne was one of the forts of the Saxon Shore, the chain of coastal strongholds built in the third century to watch the Channel, and it was also a harbour. The road existed to move goods and troops between the inland capital and the sea, and it does so with almost no concession to terrain, holding a single alignment across the chalk of the North Downs for about twenty kilometres.</p>",
		modern:
			"<p>The B2068 follows it almost exactly for its full length, and is still called Stone Street on the signs. It is one of the most faithful modern survivals of a Roman alignment anywhere in Britain.</p>",
		seeing:
			"<p>Drive or cycle the B2068 south from Canterbury. The road runs straight to the horizon over the downs with barely a bend, and from the higher ground you can see several kilometres of it laid out ahead.</p><p>At the southern end, Stutfall Castle below Lympne preserves the tumbled walls of the Saxon Shore fort, slumped down the hillside by centuries of landslip.</p>",
		faq: [
			{
				q: "Is the B2068 a Roman road?",
				a: "Yes, and unusually faithfully. The B2068 between Canterbury and Lympne follows Stone Street along almost its entire length, still carrying the Roman name.",
			},
			{
				q: "Why is Stone Street so straight?",
				a: "It crosses open chalk downland with no significant obstacles, and its job was to link Canterbury to the coast as directly as possible. Roman surveyors aligned roads between fixed sighting points, and over this ground there was nothing to force a deviation.",
			},
		],
	},

	"ryknild-street": {
		route:
			"<p>Ryknild Street ran north from a junction with the Fosse Way near Bourton-on-the-Water in Gloucestershire, up through the West Midlands to the fort at <em>Templeborough</em> near Rotherham in South Yorkshire.</p><p>It passed <em>Alcester</em> in Warwickshire, crossed Watling Street at <em>Letocetum</em> at Wall in Staffordshire, and continued through Derbyshire past Little Chester near Derby and up the Trent and Rother valleys. The crossing at Wall, where two major roads met at right angles beside a Roman bath house and inn, was one of the important junctions of the province.</p>",
		modern:
			"<p>The A38 follows the line closely through Staffordshire and Derbyshire. North of Burton-on-Trent the modern road runs nearly straight for a long stretch, the surveying made easy by the broad flat Trent valley. Icknield Street, an alternative spelling of the same road name, appears on street signs in Birmingham.</p>",
		seeing:
			"<p><em>Letocetum</em> at Wall, near Lichfield, is the best stop: the excavated bath house and mansio sit at the crossroads of Ryknild Street and Watling Street.</p><p>In Birmingham, Sutton Park preserves a genuinely impressive stretch of the road as a raised <em>agger</em> running through open parkland, one of the few Roman roads anywhere to survive inside a major British city.</p>",
		faq: [
			{
				q: "Is Ryknild Street the same as the Icknield Way?",
				a: "No, though the names are easily confused and are probably related. The Icknield Way is a prehistoric trackway across the chalk of southern England. Ryknild Street is a Roman road through the Midlands. Medieval writers seem to have borrowed the older name for the newer road.",
			},
			{
				q: "Is the A38 a Roman road?",
				a: "Through Staffordshire and Derbyshire, largely yes. The A38 follows Ryknild Street along a good deal of its length, particularly the long straight run north of Burton-on-Trent.",
			},
		],
	},

	"maiden-way": {
		route:
			"<p>The Maiden Way ran north from the fort at <em>Bravoniacum</em> at Kirkby Thore in the Eden valley, climbed onto the high Pennines, and reached the wall fort at <em>Magnis</em> at Carvoran near Greenhead.</p><p>It crossed some of the most exposed ground any Roman road in Britain had to cover, holding above four hundred metres for long stretches over open fell. As well as connecting the Eden valley to the frontier it served the lead and silver mines of Alston Moor, which the Roman state worked directly.</p>",
		modern:
			"<p>Essentially none. The A686 and A689 cross the same country but take different lines. The Maiden Way runs over ground that no modern road has ever wanted, and it survives largely because of that.</p>",
		seeing:
			"<p>The stretch across the moor above Kirkland, climbing toward Melmerby Fell, is the classic one. In the right light the road shows as a pale ribbon running dead straight up the heather.</p><p>At the northern end, the Roman Army Museum at Carvoran sits at the road's junction with Hadrian's Wall, next to some of the best-preserved wall country.</p>",
		faq: [
			{
				q: "Why is it called the Maiden Way?",
				a: "From the Old English mægden, in the older sense of untouched or never taken, the same sense that gives Maiden Castle its name. The road crossed empty upland that had never been settled or enclosed.",
			},
			{
				q: "Why did the Romans build a road over such high ground?",
				a: "Two reasons. It was the direct line between the Eden valley forts and the western end of Hadrian's Wall, and it served the lead and silver mines of Alston Moor, which were worked under state control.",
			},
		],
	},

	"devils-causeway": {
		route:
			"<p>The Devil's Causeway branched from Dere Street at Beukley, on the high ground north-west of Corbridge, and ran north-east across Northumberland to the mouth of the Tweed near Berwick.</p><p>It crossed the Wansbeck, the Coquet and the Aln, serving the forts and settlements of the north-east coastal plain. Its purpose was to give the army a route up the eastern side of Northumberland without funnelling everything through the Cheviot crossings that Dere Street used.</p>",
		modern:
			"<p>The B6342 follows part of the line, and a number of minor roads and farm tracks sit on it further north. No major modern road took it up, so much of its length crosses open farmland as a hedge line, a field boundary or a right of way.</p>",
		seeing:
			"<p>Ordnance Survey maps mark long stretches simply as Roman Road, and the line is easy to follow on the ground north of Longframlington and toward Lowick.</p><p>The country it crosses is quiet and open, and the road's straightness across the rolling Northumberland farmland is plain from any rise.</p>",
		faq: [
			{
				q: "Why is it called the Devil's Causeway?",
				a: "The same medieval instinct that named the Devil's Highway in Berkshire. A dead straight road running for sixty miles across empty country, built by nobody within memory, was easier to attribute to the devil than to explain.",
			},
			{
				q: "Where did the Devil's Causeway go?",
				a: "From a junction with Dere Street at Beukley, north of Corbridge, north-east across Northumberland to the mouth of the Tweed at Berwick, a distance of about sixty miles.",
			},
		],
	},

	"high-street": {
		route:
			"<p>The road climbed from the fort at <em>Galava</em> at Ambleside, at the head of Windermere, up onto the long north-south ridge above Kirkstone and held to it for most of its length before dropping into the Eden valley at <em>Brocavum</em> at Brougham near Penrith.</p><p>For much of the way it runs above seven hundred metres, over ground that is open fell with no shelter of any kind. It is the highest Roman road in Britain. The ridge it follows has taken the road's name: the mountain is called High Street, one of very few English hills named after a piece of Roman infrastructure.</p>",
		modern:
			"<p>None whatsoever. No modern road follows it, and none ever will. The A592 over Kirkstone Pass crosses the same range by a wholly different and much lower line.</p>",
		seeing:
			"<p>The full traverse from Ambleside to Brougham is a serious mountain walk and one of the finest ridge routes in the Lake District. The summit plateau of High Street itself carries visible traces of the road, and the broken <em>agger</em> can be picked out along the ridge in several places.</p><p>Go in clear weather. The ground is exposed and the navigation is not trivial in cloud.</p>",
		faq: [
			{
				q: "Is High Street the highest Roman road in Britain?",
				a: "Yes. It holds above seven hundred metres for much of its length across the Lake District fells, higher than any other known Roman road in the country.",
			},
			{
				q: "Is the mountain named after the road, or the road after the mountain?",
				a: "The mountain is named after the road. High Street is one of a very small number of British hills to take its name from Roman engineering.",
			},
			{
				q: "Why did the Romans build a road along a mountain ridge?",
				a: "Because the ridge was the easiest continuous line available. The valleys below were boggy, wooded and broken by lakes; the high ground was open, drained and gave clear sightlines for surveying.",
			},
		],
	},

	"icknield-way": {
		route:
			"<p>The Icknield Way runs along the chalk from Norfolk south-west through the Chilterns toward the Wessex downs, following the dry high ground above the wooded and waterlogged clay of the vales.</p><p>It is prehistoric. It was in use for many centuries before the conquest and it is not a Roman road in origin or in engineering. The Romans metalled sections of it where the line served their network, notably between Ivinghoe and Tring, and they built other roads that crossed it, but they never rebuilt it as a whole.</p>",
		modern:
			"<p>The A505 near Baldock and the A5 near Dunstable pick up parts of the corridor. Icknield Street and Icknield Way appear as street names in a dozen towns along the route.</p>",
		seeing:
			"<p>The Icknield Way Path and the Ridgeway National Trail between them cover most of the historic route. The stretch over Ivinghoe Beacon in the Chilterns is the best known and the most walked.</p><p>Because the way is a braided corridor of parallel tracks rather than a single engineered line, what you walk is the general route rather than one fixed road.</p>",
		faq: [
			{
				q: "Is the Icknield Way a Roman road?",
				a: "Not in origin. It is a prehistoric trackway that was already ancient when the Romans arrived. They surfaced sections of it where it suited their network, but the route is far older than Rome.",
			},
			{
				q: "How old is the Icknield Way?",
				a: "Its use goes back into prehistory, with evidence of the chalk ridge route being travelled in the Neolithic and Bronze Age. It is often described as one of the oldest roads in Britain, though as a corridor of tracks rather than a single constructed road.",
			},
			{
				q: "Where does the name come from?",
				a: "From the Iceni, the tribe of Norfolk and Suffolk whose territory the eastern end of the route crossed.",
			},
		],
	},

	"military-way": {
		route:
			"<p>The Military Way is not a single named route but the service road that ran behind a Roman frontier wall, linking its forts, milecastles and turrets.</p><p>Two frontiers in Britain had one. Behind Hadrian's Wall it ran the full width of the country from Wallsend to Bowness-on-Solway, generally a little to the south of the wall and between it and the Vallum. Behind the Antonine Wall a shorter equivalent ran across the central belt of Scotland from the Forth to the Clyde.</p><p>Its purpose was lateral movement: getting men and supplies quickly along the frontier rather than through it.</p>",
		modern:
			"<p>The B6318, confusingly called the Military Road, is an eighteenth-century construction built largely on top of Hadrian's Wall itself after the Jacobite rising, not on the Roman Military Way. The two should not be confused.</p>",
		seeing:
			"<p>The clearest surviving stretches are in the central sector of Hadrian's Wall, between Housesteads and Steel Rigg, where the Roman road shows as a low raised band of grass and stone running parallel to the wall a short distance south of it.</p><p>Walk the Hadrian's Wall Path through that section and the Military Way, the Vallum and the wall are all visible together, which makes the logic of the whole frontier system suddenly obvious.</p>",
		faq: [
			{
				q: "Is the Military Road the same as the Military Way?",
				a: "No, and the similarity of the names causes constant confusion. The Military Way is the Roman service road behind the wall. The Military Road is the modern B6318, built in the 1750s largely on top of the wall itself.",
			},
			{
				q: "What was the Military Way for?",
				a: "Moving troops and supplies along the frontier. The wall itself was a barrier; the road behind it let the garrison shift men quickly between milecastles and forts in response to trouble anywhere along the line.",
			},
		],
	},

	"stainmore-pass": {
		route:
			"<p>The road ran west from <em>Cataractonium</em> at Catterick, the major road town on Dere Street, up Teesdale and over the Stainmore pass at about four hundred and fifty metres, then down into the Eden valley and on to the Cumbrian coast at <em>Glannoventa</em> at Ravenglass.</p><p>The fort at <em>Lavatris</em> at Bowes guarded the eastern approach to the summit, and the small fort at Maiden Castle watched the pass itself. This was the connecting line between the eastern and western halves of Roman northern Britain: without it, the Cumbrian forts would have been cut off behind the Pennines.</p>",
		modern:
			"<p>The A66 crosses Stainmore by essentially the same line, for the same reasons. It is one of the clearest cases in Britain of a modern trunk road existing because Roman surveyors identified the only sensible crossing of a mountain barrier.</p>",
		seeing:
			"<p>The drive over Stainmore on the A66 is the experience. The Roman fort earthworks at Bowes are visible beside the road, with a Norman keep built inside them, and the Rey Cross monument stands near the summit close to the site of a large Roman marching camp.</p><p>In winter the A66 over Stainmore closes in high winds and snow. The Romans will have had the same problem.</p>",
		faq: [
			{
				q: "Is the A66 a Roman road?",
				a: "Over Stainmore, essentially yes. The modern A66 crosses the pass on close to the Roman line, because the geography allows very little choice about where to cross.",
			},
			{
				q: "Why was the Stainmore road important?",
				a: "It was the only practical east-west crossing of the northern Pennines. It linked Dere Street and the eastern forts to Carlisle, the Eden valley and the Cumbrian coast, and without it Roman Cumbria would have been isolated behind the hills.",
			},
		],
	},
};
