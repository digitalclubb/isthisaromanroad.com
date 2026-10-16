/**
 * Long-form content for the /road/[slug] pages.
 *
 * Deliberately NOT in stories.ts. That module is imported by the homepage
 * (`findStoryFor`) and therefore lands in the client bundle; the ~20,000 words
 * here would ship to every visitor for no runtime benefit. This module is
 * imported only from `road/[slug]/+page.server.ts`, so it is inlined into the
 * prerendered road pages at build time and never sent as JavaScript.
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
			"<p>The road began at <em>Rutupiae</em>, the invasion beachhead at Richborough, where a great four-way triumphal arch once marked the formal entrance to the province. From there it ran west to <em>Durovernum Cantiacorum</em> at Canterbury, then north-west through <em>Durobrivae</em> at Rochester, crossing the Medway, then on over Shooter's Hill into <em>Londinium</em>.</p><p>North of the Thames it resumed as the great diagonal of the province. It passed <em>Verulamium</em> at St Albans, <em>Durocobrivis</em> at Dunstable, <em>Lactodorum</em> at Towcester and reached <em>Venonis</em> at High Cross in Leicestershire, where it crossed the Fosse Way at a near-perfect right angle. Beyond that it ran through <em>Letocetum</em> at Wall in Staffordshire and finished at <em>Viroconium Cornoviorum</em> at Wroxeter, for a time the fourth largest town in Roman Britain.</p>",
		modern:
			"<p>Watling Street is the most completely surviving of all Britain's Roman roads. The A2 carries its line from Dover through Canterbury to London. In the capital the road is still legible in the street plan: Edgware Road running north-west from Marble Arch is Watling Street, and the name persists on signposts in Bexleyheath and Radlett.</p><p>North-west of London the A5 follows the Roman surveying so closely that for long stretches the modern carriageway sits within a few metres of the original line. The M1 was built to relieve it, not to replace it. Where the A5 runs dead straight for miles across Northamptonshire and Warwickshire, that is Roman work.</p>",
		seeing:
			"<p><em>Letocetum</em> at Wall, near Lichfield, is the best single stop: National Trust land in English Heritage guardianship, with the excavated remains of a Roman bath house and mansio sitting directly on the road. <em>Verulamium</em> park at St Albans has the town walls and a mosaic and hypocaust in situ; the Roman theatre, the only one visible in Britain, is just outside the park on the Gorhambury Estate and charges separately.</p><p>For the road itself, the stretch of the A5 between Towcester and High Cross is the classic drive. At High Cross a battered eighteenth-century monument marks the crossing with the Fosse Way, traditionally called the centre of Roman Britain.</p>",
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
			"<p>Lincoln is the obvious destination. The Newport Arch, at the north end of Bailgate in the upper city, is the only Roman gateway in Britain still standing over a road carrying traffic, and the traffic below it is on the line of Ermine Street.</p><p>For the road as a road, drive or cycle the A15 north from Lincoln towards the Humber. The horizon-to-horizon straightness across the flat Lincolnshire farmland gives a clearer sense of Roman surveying than any excavated site.</p>",
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
			"<p>The Fosse Way ran from <em>Isca Dumnoniorum</em> at Exeter north-east across the whole width of southern Britain. It passed <em>Lindinis</em> at Ilchester, skirted <em>Aquae Sulis</em> at Bath, and reached <em>Corinium Dobunnorum</em> at Cirencester, the second largest town in the province.</p><p>From Cirencester it ran on through the Cotswolds past Moreton-in-Marsh to <em>Venonis</em> at High Cross, where it crossed Watling Street. It continued through <em>Ratae Corieltauvorum</em> at Leicester and past Newark to finish at <em>Lindum</em> at Lincoln.</p><p>Its straightness is the thing most often remarked on. Between Lincoln and Ilchester, a stretch of some two hundred and ninety kilometres, the road never strays more than about ten kilometres from a straight line drawn between those two points. The full route to Exeter is nearer three hundred and seventy.</p>",
		modern:
			"<p>No single modern road carries the whole Fosse Way, which is part of its charm. The A37 and A367 follow it in Somerset, the A429 through the Cotswolds between Cirencester and Moreton-in-Marsh, and the A46 north of Leicester towards Newark and Lincoln.</p><p>Between those stretches the road survives as unclassified lanes, farm tracks and field boundaries. The A429 is the section most drivers notice: it runs straight and fast across the Cotswold plateau in a way that no medieval road ever does.</p>",
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
			"<p>It left London at the southern bridgehead in Southwark and headed for Ewell, then crossed the Mole near Dorking and climbed the chalk scarp of the North Downs close to Box Hill.</p><p>Beyond the Downs it ran through the heavy clay of the Sussex Weald, passed the posting station at Alfoldean, crossed the Arun and climbed the South Downs at Bignor before dropping into the coastal plain and the civitas capital of the Regni.</p><p>The opening alignment out of London was fixed on Chichester, entirely out of sight beyond two ranges of hills, which is the real measure of the work.</p>",
		modern:
			"<p>The A29 through Sussex follows long sections, particularly between Billingshurst and Pulborough. In Surrey the A24 shadows the line near Dorking. Within London the road is largely built over, though Kennington Park Road and Clapham Road sit on it.</p><p>Much of the middle of the route was never adopted by a modern road at all, which is why so much of it survives as footpath and bridleway across the Weald and the Downs.</p>",
		seeing:
			"<p>Bignor Roman Villa sits just north of the South Downs beside the road, and its mosaics are among the finest in Britain. The climb of Bignor Hill immediately above it carries a well-preserved stretch of the road, now a chalk track through open downland.</p><p>The section through Eartham Wood, managed by Forestry England, has an excavated <em>agger</em> with the original flint metalling exposed and interpreted.</p>",
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
				a: "Yes. Substantial sections across the South Downs, particularly over Bignor Hill and through Eartham Wood, are public rights of way, and the National Trust and Forestry England maintain access to several of the best preserved stretches.",
			},
		],
	},

	"akeman-street": {
		route:
			"<p>Akeman Street ran west from <em>Verulamium</em> at St Albans, where it left Watling Street, and headed for the Chilterns. It passed through Tring and Aylesbury, then ran across the Oxfordshire clay past Alchester near Bicester, a small walled town at an important junction.</p><p>West of Alchester it continued past the villa at North Leigh and through the Windrush valley to reach <em>Corinium Dobunnorum</em> at Cirencester, where it met the Fosse Way. Watling Street, Akeman Street and the Fosse Way together enclosed the wealthiest and most Romanised part of the province.</p>",
		modern:
			"<p>The A41 picks up the line near Tring and follows it, on and off, towards Bicester. West of there the modern road network largely abandons it, and the Roman route survives as minor lanes and green tracks through west Oxfordshire and the Cotswolds.</p>",
		seeing:
			"<p>North Leigh Roman Villa in Oxfordshire sits just off the road and has a fine mosaic under cover. The green lane sections between Kirtlington and Ramsden are walkable and unusually undisturbed.</p><p>At Cirencester the Corinium Museum sets the road in the context of the town it served.</p>",
		faq: [
			{
				q: "Where does the name Akeman Street come from?",
				a: "It is Old English. The Anglo-Saxons called Bath Acemannesceaster, the town of Aceman, and Akeman Street was understood as the road leading towards it from the east.",
			},
			{
				q: "Is the A41 a Roman road?",
				a: "Along part of its length. Between Tring and the Bicester area the A41 follows Akeman Street reasonably closely, though the correspondence is looser than that of the A5 with Watling Street.",
			},
		],
	},

	"dere-street": {
		route:
			"<p>Dere Street ran north from <em>Eboracum</em> at York, the legionary fortress and later capital of Britannia Inferior. It passed <em>Isurium Brigantum</em> at Aldborough and <em>Cataractonium</em> at Catterick, crossed the Tees and reached <em>Vinovia</em> at Binchester.</p><p>It continued north to <em>Coria</em> at Corbridge, the great supply base on the Tyne just south of Hadrian's Wall, and crossed the wall itself at the Portgate. Beyond the frontier it pushed on through Redesdale and over the Cheviots at Chew Green, then ran through the Scottish borders past Trimontium at Newstead to reach Inveresk on the Firth of Forth.</p>",
		modern:
			"<p>The A1 follows the line closely between York and Scotch Corner. North of Corbridge the A68 takes up the route across Northumberland and into Scotland, and its long straight climbs and sudden crests are a direct consequence of Roman surveying that took hills head on rather than contouring around them.</p>",
		seeing:
			"<p>Corbridge Roman Town is the best stop: Dere Street runs north through the site, and the excavated main street you walk down is the Stanegate, rerouted through the town. Chew Green in the Cheviots preserves a remarkable set of Roman camp earthworks in wholly empty country. It lies inside the Otterburn military training area, so check the published firing times before going.</p><p>The A68 north of Corbridge is the drive. Its switchback profile is the single clearest demonstration in Britain of how Roman roads treated terrain.</p>",
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
			"<p>The road starts near Knettishall Heath and runs north-west across the county to the sea. It holds a remarkably consistent alignment for about seventy kilometres over gently rolling chalk and sand.</p><p>Its purpose is generally read as military. The road was laid out in the years after the Boudican revolt of AD 60 and 61, cutting directly through the territory of the defeated Iceni, and it may have continued by ferry across the Wash to the Lincolnshire shore.</p>",
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
				a: "The usual reading is that Rome built it to control the Iceni after Boudica's revolt was crushed in AD 61: it drives straight through their heartland, which is how an army secures hostile territory rather than how a trade route follows demand. Parts of the line may follow an older trackway the Romans remade rather than laid out from nothing.",
			},
		],
	},

	"via-devana": {
		route:
			"<p>The route as proposed runs diagonally across England from <em>Camulodunum</em> at Colchester through Cambridge and Godmanchester, then north-west through the Midlands to <em>Deva Victrix</em> at Chester.</p><p>Real Roman road certainly exists along parts of that line. The stretch from Colchester towards Cambridge is well attested, and the section from Cambridge to Godmanchester is clear on the ground. Beyond Godmanchester the evidence thins, and the western half was for a long time omitted from some historians' maps for that reason, though most now accept the route.</p>",
		modern:
			"<p>The A1307 between Cambridge and Haverhill follows parts of the eastern section. The A604 is sometimes cited for this road, but that number was retired in the 1990s and split between the A14 and the A1307.</p>",
		seeing:
			"<p>The Gog Magog hills south-east of Cambridge carry a clear stretch as a chalk track with wide views. <em>Durovigutum</em> at Godmanchester has a well-understood Roman town plan and the road's junction with Ermine Street.</p>",
		faq: [
			{
				q: "Did the Via Devana really exist?",
				a: "Not as a single named Roman highway. The name was coined in the eighteenth century by the Cambridge antiquary Charles Mason for a route from Colchester to Chester. Roman roads certainly exist along much of that line and most archaeologists now accept the route, but the name is a Georgian invention and the western half is less securely traced than the eastern.",
			},
			{
				q: "What does Via Devana mean?",
				a: "The road to Deva. Deva Victrix was the Roman legionary fortress at Chester, and the name was invented to describe a road supposedly aimed at it.",
			},
		],
	},

	"sarn-helen": {
		route:
			"<p>The northern end is given variously as <em>Segontium</em>, the fort at Caernarfon, or <em>Canovium</em> at Caerhun in the Conwy valley. From there the line runs south-east past the fort at Tomen y Mur near Trawsfynydd, over the moors above Ffestiniog and down through mid Wales.</p><p>It continues past the gold mines at Dolaucothi, which the Roman state worked on a large scale, and reaches <em>Maridunum</em> at Carmarthen in the south-west. Several branches and alternative alignments carry the same name locally.</p>",
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
			"<p>From Corbridge on the Tyne to Carlisle on the Eden it followed the natural corridor of the Tyne and Irthing valleys rather than the ridge line that Hadrian's Wall would later take.</p><p>Forts were built along it under the Flavian emperors and then more densely under Trajan: Vindolanda, Nether Denton, Carvoran and others. For roughly a generation, from about AD 105 until the wall was begun around AD 122, this string of forts along a road was the northern frontier of the Roman empire in Britain.</p>",
		modern:
			"<p>The A69 between Corbridge and Carlisle shares the corridor rather than the alignment, taking an easier course along the valley bottom where the Roman road held higher ground.</p><p>The minor road known as the Military Road, the B6318, is a different thing entirely and is largely eighteenth century, built on the wall rather than on the Stanegate.</p>",
		seeing:
			"<p>Vindolanda is the essential visit. The fort and its excavated civilian settlement sit directly on the Stanegate, and the site's waterlogged deposits produced the writing tablets that are the richest surviving evidence of everyday life on the empire's northern frontier.</p><p>The stretch of surviving road immediately outside the Vindolanda site is visible and walkable, with an original Roman milestone still standing in position beside it.</p>",
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
			"<p>From Ermine Street near <em>Durobrivae</em> the road ran past Bourne and rejoined Ermine Street about a kilometre south of Ancaster. The road on north from Bourne towards Sleaford is Mareham Lane, a separate Roman route.</p><p>The lower line through the fen edge came at a cost: it needed a raised causeway across ground that flooded. It served the salt-making and farming settlements of the fenland, a landscape the Romans drained and exploited intensively.</p>",
		modern:
			"<p>Very little of it. On a map the stretch south of Bourne is easy to pick out as an unusually straight run among otherwise unremarkable country roads; north of Bourne it has largely gone.</p>",
		seeing:
			"<p>The fen-edge lanes around Baston and Kate's Bridge give the clearest sense of it. This is quiet, flat country and the road's straightness across it is unmistakable.</p><p>Nearby, the Roman town at Water Newton and the Car Dyke, a major Roman watercourse running roughly parallel, put the road in the context of a heavily engineered fenland landscape.</p>",
		faq: [
			{
				q: "Why is it called King Street?",
				a: "The name is medieval and honorific rather than Roman. No Roman name for the road has come down to us. King Street simply marked it out as a major highway in a period when most roads belonged to no one in particular.",
			},
			{
				q: "How is King Street different from Ermine Street?",
				a: "They are parallel routes that split near Water Newton and rejoin south of Ancaster. Ermine Street took the higher, drier ground to the east; King Street ran lower through the fen edge on a built causeway.",
			},
		],
	},

	"pye-road": {
		route:
			"<p><em>Camulodunum</em> at Colchester was the first Roman colony in Britain; <em>Venta Icenorum</em> at Caistor St Edmund, just south of modern Norwich, was the civitas capital of the Iceni.</p><p>The road crossed the Stour near Stratford St Mary, ran up through Suffolk past the small town at Coddenham, crossed the Waveney at Scole where a substantial roadside settlement grew up, and continued over the Tas to Caistor. Its purpose was administrative: it tied the defeated Iceni to the colony that symbolised Roman power in the region.</p>",
		modern:
			"<p>The A140 between Ipswich and Norwich follows the Roman line closely for most of its length, which is why it runs so much straighter than the lanes around it. The A12 near Stratford St Mary picks up the southern end.</p>",
		seeing:
			"<p><em>Venta Icenorum</em> at Caistor St Edmund is the destination and it is an unusual one: the town was never built over, so the full circuit of its walls survives as earthworks in open fields, freely accessible, with the street grid showing in crop marks from the air.</p><p>Scole, where the road crossed the Waveney, produced one of the richest roadside settlement excavations in East Anglia.</p>",
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
			"<p><em>Calleva Atrebatum</em> at Silchester, at the western end, was a walled town, the tribal capital of the Atrebates and a major road hub in its own right.</p><p>The road crossed the Thames at <em>Pontes</em> near Staines, then ran across the Bagshot heaths and the sandy country of east Berkshire, through what is now Crowthorne and Wokingham, before approaching Silchester from the east. The line is direct and fast, chosen for speed across poor and thinly settled ground.</p>",
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
			"<p>Ackling Dyke is the name given to the Roman road running south-west from <em>Sorviodunum</em> at Old Sarum, just north of modern Salisbury, across Cranborne Chase to Badbury Rings, about twenty-two miles. The road continued to <em>Durnovaria</em> at Dorchester, though that stretch is usually counted separately.</p><p>It climbed onto the chalk downland and held to the high ground, passing close to the Iron Age hillfort at Badbury Rings and through a landscape already dense with Bronze Age barrows. The Roman engineers drove the road straight through that prehistoric cemetery, in places cutting into the barrows themselves.</p>",
		modern:
			"<p>The B3081 and various minor roads take up short sections, and the A354 between Salisbury and Blandford runs in the same corridor. But much of the best-preserved length crosses land that never carried a modern road, which is precisely why it survives so well.</p>",
		seeing:
			"<p>This is among the finest surviving Roman road earthworks in Britain. Between Badbury Rings and Bottlebush Down the <em>agger</em> runs up to fifteen metres wide and stands nearly two metres above the surrounding fields, unmistakable and walkable for several kilometres.</p><p>The National Trust land around Badbury Rings gives the easiest access. Park at the rings and follow the road north-east, towards Oakley Down and Old Sarum.</p>",
		faq: [
			{
				q: "What is an agger?",
				a: "The raised embankment on which a Roman road was built, formed from material dug out of the ditches either side. It lifted the running surface clear of standing water. Ackling Dyke has one of the most impressive surviving aggers in Britain, up to fifteen metres wide and standing nearly two metres high.",
			},
			{
				q: "Where is the best place to walk Ackling Dyke?",
				a: "The stretch between Badbury Rings and Bottlebush Down in Dorset, where the road survives as a broad raised bank across open downland, accessible on foot from the National Trust car park at Badbury Rings by heading north-east.",
			},
		],
	},

	"stone-street": {
		route:
			"<p>Lympne was one of the forts of the Saxon Shore, the chain of coastal strongholds built in the third century to watch the Channel, and it was also a harbour. The road existed to move goods and troops between the inland capital and the sea, and it does so with almost no concession to terrain, holding a single alignment across the chalk of the North Downs for about twenty kilometres.</p>",
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
			"<p>Leaving the Fosse Way it passed <em>Alcester</em> in Warwickshire, crossed Watling Street at <em>Letocetum</em> at Wall in Staffordshire, and continued through Derbyshire past Little Chester near Derby and up the Trent and Rother valleys. The crossing at Wall, where two major roads met at right angles beside a Roman bath house and inn, was one of the important junctions of the province.</p>",
		modern:
			"<p>The A38 follows the line closely through Staffordshire and Derbyshire. Icknield Street, an alternative spelling of the same road name, appears on street signs in Birmingham.</p>",
		seeing:
			"<p><em>Letocetum</em> at Wall, near Lichfield, is the best stop: the excavated bath house and mansio sit at the crossroads of Ryknild Street and Watling Street, National Trust land in English Heritage guardianship.</p><p>In Birmingham, Sutton Park preserves a genuinely impressive stretch of the road as a raised <em>agger</em> running through open parkland, one of the few Roman roads anywhere to survive inside a major British city.</p>",
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
			"<p>From the Eden valley it climbed straight onto the high Pennines and reached the wall at Carvoran near Greenhead. As well as connecting the Eden valley to the frontier it served the lead and silver mines of Alston Moor, which the Roman state worked directly.</p>",
		modern:
			"<p>Essentially none. The A686 and A689 cross the same country but take different lines. The Maiden Way runs over ground that no modern road has ever wanted, and it survives largely because of that.</p>",
		seeing:
			"<p>The stretch across the moor above Kirkland, climbing towards Melmerby Fell, is the classic one. In the right light the road shows as a pale ribbon running dead straight up the heather.</p><p>At the northern end, the Roman Army Museum at Carvoran sits at the road's junction with Hadrian's Wall, next to some of the best-preserved wall country.</p>",
		faq: [
			{
				q: "Why is it called the Maiden Way?",
				a: "Most likely from the Maiden Castle fortlet on Stainmore, which the road passes. The medieval forms are Via Puellarum and Maydengathe, both meaning the maidens' road, so reading the name as untaken ground is probably a later rationalisation.",
			},
			{
				q: "Why did the Romans build a road over such high ground?",
				a: "Two reasons. It was the direct line between the Eden valley forts and the western end of Hadrian's Wall, and it served the lead and silver mines of Alston Moor, which were worked under state control.",
			},
		],
	},

	"devils-causeway": {
		route:
			"<p>The Portgate sits on the high ground where Dere Street crosses Hadrian's Wall. From there the road ran north-east across Northumberland to the mouth of the Tweed, about fifty-five miles.</p><p>It crossed the Wansbeck, the Coquet and the Aln, serving the forts and settlements of the north-east coastal plain. Its purpose was to give the army a route up the eastern side of Northumberland without funnelling everything through the Cheviot crossings that Dere Street used.</p>",
		modern:
			"<p>The A697 touches, crosses and briefly follows the line in the middle of the county, and minor roads and farm tracks sit on it further north. No major modern road took it up, so much of its length crosses open farmland as a hedge line, a field boundary or a right of way.</p>",
		seeing:
			"<p>Ordnance Survey maps mark long stretches simply as Roman Road, and the line is easy to follow on the ground north of Longframlington and towards Lowick.</p><p>The country it crosses is quiet and open, and the road's straightness across the rolling Northumberland farmland is plain from any rise.</p>",
		faq: [
			{
				q: "Why is it called the Devil's Causeway?",
				a: "The same medieval instinct that named the Devil's Highway in Berkshire. A dead straight road running for sixty miles across empty country, built by nobody within memory, was easier to attribute to the devil than to explain.",
			},
			{
				q: "Where did the Devil's Causeway go?",
				a: "From a junction with Dere Street at the Portgate, north of Corbridge, north-east across Northumberland to the mouth of the Tweed at Berwick, about fifty-five miles.",
			},
		],
	},

	"high-street": {
		route:
			"<p>The road climbed from the fort at <em>Galava</em> at Ambleside, at the head of Windermere, up onto the long north-south ridge above Kirkstone and held to it for most of its length before dropping into the Eden valley at <em>Brocavum</em> at Brougham near Penrith.</p><p>Along the ridge itself there is open fell and no shelter of any kind. The ridge has taken the road's name: the mountain is called High Street, one of very few English hills named after a piece of Roman infrastructure. Not every archaeologist accepts the whole line as Roman, since much of it survives as a worn hollow rather than a built embankment.</p>",
		modern:
			"<p>None whatsoever. No modern road follows it, and none ever will. The A592 over Kirkstone Pass crosses the same range by a wholly different and much lower line.</p>",
		seeing:
			"<p>The full traverse from Ambleside to Brougham is a serious mountain walk and one of the finest ridge routes in the Lake District. The summit plateau of High Street itself carries visible traces of the road, and the broken <em>agger</em> can be picked out along the ridge in several places.</p><p>Go in clear weather. The ground is exposed and the navigation is not trivial in cloud.</p>",
		faq: [
			{
				q: "Is High Street the highest Roman road in England?",
				a: "Along the ridge it climbs above seven hundred metres, higher than any other known Roman road in England. The line has been questioned in places, since much of it survives as a worn hollow rather than a built embankment.",
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
			"<p>The Icknield Way runs along the chalk from Norfolk south-west through the Chilterns towards the Wessex downs, following the dry high ground above the wooded and waterlogged clay of the vales.</p><p>It is not a Roman road in origin or in engineering. Where the Romans used it they metalled the existing line rather than resurveying it, and most of the roads they built themselves cross it rather than follow it.</p>",
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
			"<p>Behind Hadrian's Wall it ran the full width of the country from Wallsend to Bowness-on-Solway, generally a little to the south of the wall and between it and the Vallum. The Antonine Wall's shorter equivalent ran from the Forth to the Clyde.</p><p>Its purpose was lateral movement: getting men and supplies quickly along the frontier rather than through it.</p>",
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
			"<p>The road ran west from <em>Cataractonium</em> at Catterick, the major road town on Dere Street, up Teesdale and over the Stainmore pass at about four hundred and fifty metres, then down into the Eden valley to <em>Brocavum</em> at Brougham, and on to Carlisle. Ravenglass on the Cumbrian coast was reached by a different road altogether, over Hardknott and the High Street ridge.</p><p>The fort at <em>Lavatris</em> at Bowes guarded the eastern approach to the summit, and the small fort at Maiden Castle watched the pass itself. This was the connecting line between the eastern and western halves of Roman northern Britain: without it, the Cumbrian forts would have been cut off behind the Pennines.</p>",
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
				a: "It was the lowest and most practical east-west crossing of the northern Pennines, though not the only one. It linked Dere Street and the eastern forts to Carlisle and the Eden valley, and without it Roman Cumbria would have been far harder to supply.",
			},
		],
	},
	"via-appia": {
		route:
			"<p>The road left <em>Roma</em> by the Porta Capena in the old Servian wall. When the Aurelian Walls went up in the third century AD the city gate on the road became the Porta Appia, now Porta San Sebastiano. It climbed the Alban Hills past <em>Aricia</em>, then ran almost dead straight across the Pontine plain. In 37 BC Horace crossed the marshes here by night on a canal barge. At <em>Tarracina</em>, modern Terracina, the coast pinches against the cliff of Pisco Montano. Under Trajan, engineers cut the rock back to carry the road round it.</p><p>Beyond, it turned inland through <em>Fundi</em> at Fondi and the hills around Itri, met the sea again at Formia and crossed the Liris, today's Garigliano, at <em>Minturnae</em>. Appius Claudius's road ended at <em>Capua</em>, the modern Santa Maria Capua Vetere. The extension ran east through the Caudine valley at <em>Caudium</em>, near Montesarchio, and entered <em>Beneventum</em> over the Ponte Leproso.</p><p>From Benevento the survey follows the inland line over the Apennines: <em>Aeclanum</em> near Mirabella Eclano, then <em>Aquilonia</em>, then <em>Venusia</em> at Venosa, where Horace was born. It came down to <em>Tarentum</em> on the Gulf of Taranto and turned east across the heel of Italy by way of <em>Uria</em>, now Oria, to <em>Brundisium</em>.</p>",
		modern:
			"<p>Italy's SS7, the Strada Statale <em>Via Appia</em>, inherited both the name and much of the line. Created in 1928, it runs a little over 713 km from Rome to Brindisi, well over a hundred kilometres longer than the Roman road, because it bends to serve modern towns. In Rome itself traffic takes the Via Appia Nuova, laid out in 1784, while the old road runs parallel as the Appia Antica; the two meet again near Frattocchie.</p><p>The closest match is the Pontine plain. Between Latina and Terracina the SS7 sits back on the Roman alignment and runs straight for mile after mile. Beyond Capua it crosses the Caudine valley past Montesarchio to Benevento, close to the ancient line, before the two drift apart in the Apennines of Irpinia and Basilicata.</p>",
		seeing:
			"<p>The Appia Antica south of Porta San Sebastiano is the place to walk it. Past the catacombs of San Callisto and San Sebastiano it reaches the Tomb of Caecilia Metella, a drum-shaped mausoleum of the late Republic, then runs between tombs and umbrella pines past the Villa of the Quintilii to the great round mausoleum of Casal Rotondo. Long stretches keep their original basalt blocks.</p><p>Further south, the paved road runs through the excavated town at <em>Minturnae</em>. In Terracina the Trajanic cut at Pisco Montano still shows its carved numerals, ending in CXX, 120 Roman feet, about a metre above the present road. At Brindisi a single Roman column stands at the head of the harbour steps, traditionally the end of the road. Its fallen twin was given to Lecce in the seventeenth century and now carries a statue of Saint Oronzo.</p>",
		faq: [
			{
				q: "How long is the Via Appia?",
				a: "About 540 km from Rome to Brindisi, traditionally 365 Roman miles: 132 to Capua and 233 beyond. The line on this site's map measures about 575 km because it traces each surveyed segment, bends and all.",
			},
			{
				q: "Who built the Via Appia?",
				a: "The censor Appius Claudius Caecus began it in 312 BC and gave it his name. His road ran only as far as Capua; it was extended in stages over the following century and more until it reached Brindisi.",
			},
			{
				q: "Is the Via Appia a UNESCO World Heritage Site?",
				a: "Yes. It was inscribed in July 2024 as Via Appia. Regina Viarum, Italy's sixtieth World Heritage Site. The listing also covers the Via Traiana, Trajan's later route from Benevento to Brindisi.",
			},
		],
	},
	"via-egnatia": {
		route:
			"<p>The surveyed line starts at <em>Dyrrhachium</em>, with a second arm coming up from the south past <em>Apollonia</em> and <em>Byllis</em>; the two probably met near Peqin. The road then followed the Shkumbin valley to <em>Scampis</em> at Elbasan and climbed through the <em>Candavia</em> mountains to <em>Lychnidos</em> on Lake Ohrid.</p><p>From Ohrid it crossed the uplands to <em>Herakleia Lynkestis</em> outside Bitola, a city founded by Philip II, then turned east over the passes to <em>Edessa</em>. It came down to <em>Pella</em>, the old Macedonian royal capital, and on to <em>Thessalonike</em>, seat of the Roman governor.</p><p>East of <em>Thessalonike</em> it passed <em>Apollonia</em> and <em>Amphipolis</em> on the Strymon, ran through the centre of <em>Philippi</em> and came down to the sea at <em>Neapolis</em>, modern Kavala. Thrace followed: <em>Mosynopolis</em> near Komotini, <em>Traianoupolis</em> near Alexandroupoli, then <em>Cypsela</em> at the crossing of the Hebrus, the Evros of today. One arm of the survey reaches south towards <em>Kallipolis</em> on the Hellespont. The main line strikes north-east to the Sea of Marmara at <em>Rhaidestos</em>, now Tekirda\u011f, and follows the shore through <em>Herakleia Perinthos</em> and <em>Selymbria</em> to <em>Constantinopolis</em>.</p>",
		modern:
			"<p>No single modern road follows the whole line. In Albania the road east from Rrogozhin\u00eb through Peqin and Elbasan keeps to the Shkumbin valley as the Roman engineers did. In North Macedonia the road from Ohrid through Resen to Bitola crosses the same high ground. In Greece the old national road, the EO2, is the truer heir: Florina, Edessa, Giannitsa near <em>Pella</em>, Thessaloniki, Amphipolis, Kavala, Komotini and Alexandroupoli all lie on it.</p><p>The A2 motorway, the Egnatia Odos, borrows the name but only part of the route. It begins at Igoumenitsa, far south of the Roman road, and picks up the ancient corridor at Thessaloniki; from there to the Evros it runs roughly parallel for some 360 kilometres. In Turkey the D110 carries the line along the Marmara coast through Tekirda\u011f and Silivri into Istanbul.</p>",
		seeing:
			"<p>The best stretch is at <em>Philippi</em>, a UNESCO World Heritage Site since 2016, where the road served as the main street past the forum; its marble slabs still carry cartwheel ruts. A few kilometres north-west of Kavala, between Stavros and Agios Silas, roughly a kilometre of paving climbs the saddle between the plain of Philippi and the sea. The Gallikos milestone of Gnaeus Egnatius is in the Archaeological Museum of Thessaloniki.</p><p>Further west, the excavated city of <em>Herakleia Lynkestis</em> outside Bitola has a Roman theatre and early Christian floor mosaics. Original cobbles from the road are displayed inside the castle at Elbasan. In Istanbul, the Golden Gate in the Theodosian walls at Yedikule was the ceremonial entrance for emperors returning in triumph from the west.</p>",
		faq: [
			{
				q: "Who built the Via Egnatia?",
				a: "Gnaeus Egnatius, the Roman proconsul of Macedonia, in the decades after 146 BC; the road takes his name. The stretch through Thrace towards Byzantium was added later. Emperors from Trajan to Justinian repaired it.",
			},
			{
				q: "How long was the Via Egnatia?",
				a: "About 1,120 kilometres from Durr\u00ebs to Istanbul. The line drawn on this site, which includes the western branch from Apollonia, measures roughly 1,160 kilometres.",
			},
			{
				q: "Did St Paul travel on the Via Egnatia?",
				a: "Yes. Acts 16 and 17 describe Paul landing at Neapolis, now Kavala, and travelling through Philippi, Amphipolis and Apollonia to Thessalonica, all stations on the road.",
			},
		],
	},
	"via-domitia": {
		route:
			"<p>The surveyed line begins at <em>Segusio</em>, Susa, where the arch raised for Augustus by the local king Cottius still stands. It climbs the Dora Riparia valley to <em>Ad Martis</em> at Oulx, crosses the Col de Montgen\u00e8vre at about 1,850 metres and drops to <em>Brigantio</em>, Brian\u00e7on. From there it follows the Durance past <em>Eburodunum</em> at Embrun and <em>Caturigomagus</em> at Chorges to <em>Vapincum</em>, Gap, then the small station of <em>Alabonte</em> near Mon\u00eatier-Allemont.</p><p>Below <em>Segustero</em>, Sisteron, the road turns west through <em>Apta Iulia</em> at Apt and <em>Cabellio</em> at Cavaillon, passing close to <em>Glanum</em> outside Saint-R\u00e9my-de-Provence. The survey shows two ways over the Rh\u00f4ne, one by <em>Arelate</em>, Arles, the other by <em>Ugernum</em>, Beaucaire; both converge on N\u00eemes.</p><p>West of N\u00eemes it crossed the Vidourle at <em>Ambrussum</em>, skirted Montpellier and reached <em>Forum Domitii</em>, probably at Montbazin, then <em>Cessero</em> on the H\u00e9rault at Saint-Thib\u00e9ry. After <em>Baeterrae</em>, B\u00e9ziers, came Narbonne, where the road to Aquitaine branched off. The last stage passed <em>Ruscino</em> outside Perpignan and climbed to <em>Ad Pyrenaeum</em> at the Col de Panissars, where Pompey had set up a trophy in 71 BC to mark his victories in Spain.</p>",
		modern:
			"<p>In the mountains the modern road keeps to the valley floor the Roman surveyors chose. The Italian SS24 runs from Susa over Montgen\u00e8vre. On the French side the N94 follows the Durance from Brian\u00e7on through Embrun to Gap. Between Gap and Sisteron the N85 stays close to the same corridor.</p><p>West of the Durance the line is broken, surviving as lanes, field edges and the occasional straight stretch of departmental road through the Luberon country. In Languedoc the old Route Nationale 113, since renumbered as departmental roads, shadows it from N\u00eemes towards Narbonne; the A9 motorway runs roughly parallel all the way to the border. South of Perpignan the old N9 through Le Boulou and Les Cluses keeps very close to the inland branch over the pass.</p>",
		seeing:
			"<p><em>Ambrussum</em>, near Villetelle between N\u00eemes and Montpellier, is the best place to stand on the road itself. About 200 metres of paving, scored with cart ruts, climbs beside an Iron Age hillfort. A single arch of the Pont Ambroix still stands in the Vidourle. A small museum sits on the site. In Narbonne a section of the road found in 1997 lies open in the Place de l'H\u00f4tel de Ville, a few steps below the modern square.</p><p>The three-arched Pont Julien near Bonnieux carried the road over the Calavon and took car traffic until 2005; it is now on a cycle route. At Les Cluses, below the Pyrenean pass, a late Roman gate tower stands on the road and two forts guard it, built partly with blocks taken from Pompey's trophy. Excavation at Panissars in 1984 found the trophy's foundations and wheel ruts cut into the rock.</p>",
		faq: [
			{
				q: "Who built the Via Domitia?",
				a: "Gnaeus Domitius Ahenobarbus, the Roman commander who conquered the region in 121 BC, laid it out around 118 BC. The road carries his name. A milestone found at Treilles, south of Narbonne, in 1949 bears his name with the title imperator and the figure XX; it is often described as the oldest Latin inscription found in Gaul.",
			},
			{
				q: "Did Hannibal use the Via Domitia?",
				a: "No. Hannibal crossed southern Gaul in 218 BC, about a century before the road was built, though he travelled much the same corridor from the Pyrenees to the Rh\u00f4ne. Which Alpine pass he used is still argued over; Montgen\u00e8vre is only one of several candidates.",
			},
			{
				q: "Is the A9 motorway a Roman road?",
				a: "Not as built. The A9 runs roughly parallel to the Via Domitia from N\u00eemes to the Spanish border, but the Roman line lies a little inland in places, closer to the old N113 and N9.",
			},
		],
	},
	"via-aurelia": {
		route:
			"<p>The road left Rome by the Porta Aurelia on the Janiculum, today's Porta San Pancrazio. It headed west to the sea at <em>Alsium</em>, near Ladispoli. From there it kept close to the shore: past <em>Pyrgi</em>, the old port of Etruscan Caere at Santa Severa, through <em>Castrum Novum</em> near Santa Marinella and on to <em>Centumcellae</em>, where Trajan built the harbour that grew into Civitavecchia.</p><p>Further north it passed <em>Forum Aurelii</em> (probably near Montalto di Castro) before reaching <em>Cosa</em>, the Latin colony of 273 BC on its hill above the lagoon at Ansedonia. The next station was <em>Telamon</em> at Talamone, where Roman armies destroyed a Gallic invasion in 225 BC. The surveyed line then crosses the Maremma to <em>Populonium</em>, the Etruscan iron-smelting town on the headland above the Gulf of Baratti.</p><p>The last stretch ran up the coast to <em>Vada Volaterrana</em>, the harbour of inland Volterra. From there it continued to <em>Pisae</em>, where the Aurelia proper ended and the road of Scaurus began.</p>",
		modern:
			"<p>The SS1 <em>Via Aurelia</em>, created in 1928, carries the Roman name for nearly 700 km from Rome to Ventimiglia. Between Rome and Grosseto it is largely dual carriageway, in places sharing its course with the A12 motorway. Along the Lazio coast old and new roads are rarely far apart, though finds at Santa Marinella show the Roman paving ran a little nearer the sea, in places now under water.</p><p>North of Grosseto the fit loosens. The Variante Aurelia, an expressway of the 1980s and 1990s, takes through traffic inland of the coastal towns as far as Rosignano; the older road it replaced, now in provincial hands, keeps closer to the ancient route. In Rome the first stretch survives on its own as the Via Aurelia Antica, a narrow road running out from the Porta San Pancrazio.</p>",
		seeing:
			"<p><em>Cosa</em> is the place to start. The polygonal walls of the colony still ring the hilltop above Ansedonia for about a kilometre and a half, with three gates. Inside them lie the forum, the temple remains on the <em>arx</em> and the Museo Archeologico Nazionale di Cosa. Below, the piers of the <em>Portus Cosanus</em> are among the earliest Roman harbour works known.</p><p>Around Santa Marinella several small Roman bridges of the road survive beside the modern SS1; excavated remains of <em>Castrum Novum</em> lie on the shore. In Rome, walk out through the Porta San Pancrazio along the Via Aurelia Antica, past the long walls of the Villa Doria Pamphili, to follow the first kilometres of the road on foot.</p>",
		faq: [
			{
				q: "Is the SS1 a Roman road?",
				a: "Between Rome and Pisa it broadly follows the Via Aurelia, though bypasses north of Grosseto pull it away from the ancient line. North of Pisa it follows other Roman roads, including the Via Aemilia Scauri and the Via Julia Augusta, which later shared the Aurelia name.",
			},
			{
				q: "Who built the Via Aurelia?",
				a: "It is traditionally attributed to Gaius Aurelius Cotta, censor in 241 BC, but no ancient source states it directly. The continuation beyond Pisa was the work of Marcus Aemilius Scaurus in 109 BC.",
			},
			{
				q: "Where does the Via Aurelia end?",
				a: "The original road ended at Pisa, or perhaps at first at Cosa. By the imperial period the name covered the whole coastal route from Rome through Genoa to Arles in southern Gaul.",
			},
		],
	},
	"via-flaminia": {
		route:
			"<p>Inside the city the road ran north across the <em>Campus Martius</em> on the line of today's Via del Corso and left by the Porta Flaminia, now the Porta del Popolo. About three kilometres out it crossed the Tiber on the <em>Pons Mulvius</em>, rebuilt in stone by Marcus Aemilius Scaurus in 109 BC. It then headed north past <em>Saxa Rubra</em> to <em>Ocriculum</em> at Otricoli.</p><p>At <em>Narnia</em> it crossed the Nera. The surveyed line then takes the older western branch, through <em>Carsulae</em> and <em>Mevania</em> at Bevagna; a later eastern branch, which the survey labels the <em>Flaminia nova</em>, went by Terni and Spoleto and rejoined it near Foligno. Beyond, the road ran by <em>Nuceria Camellaria</em> at Nocera Umbra and up to the Apennine pass at Scheggia.</p><p>On the Adriatic side it came down through <em>Cales</em> at Cagli and the narrow Furlo gorge, the station the Romans called <em>Intercisa</em>, then past <em>Forum Sempronii</em> at Fossombrone in the Metauro valley. At <em>Fanum Fortunae</em> it met the coast and turned north through <em>Pisaurum</em> at Pesaro to finish at <em>Ariminum</em>, where the <em>Via Aemilia</em> took travellers on across the Po plain to Piacenza.</p>",
		modern:
			"<p>The SS3 <em>Via Flaminia</em> runs for about 284 km from Rome to Fano and stays close to the Roman road for much of the way. In Umbria, though, it takes the eastern branch through Terni, Spoleto and Foligno. The western branch drawn on this map, through <em>Carsulae</em> and Bevagna, is now mostly minor country roads. The modern road is signed SR3 in Lazio and SP3 across much of the Marche, where the state handed sections to regional and provincial authorities.</p><p>At the Furlo a four-lane expressway now bypasses the gorge in a tunnel more than three kilometres long, leaving the old road to local traffic. From Fano to Rimini the SS16 Adriatica takes the same coastal course as the Roman road.</p>",
		seeing:
			"<p>The Furlo gorge, a state nature reserve between Acqualagna and Fossombrone, is the best single stop. Vespasian's tunnel, about 38 metres long, was cut in AD 76 or 77 beside a much smaller and older passage, probably Etruscan or Umbrian. The old road still passes through it.</p><p>At <em>Carsulae</em>, an abandoned town near San Gemini, the road survives as the main street with its kerbs and gutters and runs under the one standing arch of the gate known as the Arco di Traiano. Narni keeps a single surviving arch of the Augustan bridge over the Nera, about 30 metres high. Rimini's Arch of Augustus, dated to 27 BC, still marks the point where the road reached the town. Fano has a second Arch of Augustus, of AD 9, where it entered <em>Fanum Fortunae</em>.</p>",
		faq: [
			{
				q: "Is the SS3 a Roman road?",
				a: "Largely. The SS3 runs from Rome to Fano on or near the line of the Via Flaminia, though in Umbria it follows the later branch through Spoleto rather than the original route through Carsulae.",
			},
			{
				q: "Who built the Via Flaminia?",
				a: "Gaius Flaminius, during his censorship in about 220 BC. He died in 217 BC leading a Roman army against Hannibal at Lake Trasimene. Augustus restored the road and most of its bridges in 27 BC.",
			},
			{
				q: "Was the Battle of the Milvian Bridge fought on the Via Flaminia?",
				a: "Yes. In AD 312 Constantine defeated Maxentius on the Via Flaminia just north of Rome, where the road crossed the Tiber on the Pons Mulvius. Maxentius drowned in the river during the retreat.",
			},
		],
	},
	"via-claudia-augusta": {
		route:
			"<p>The western branch left the Po at <em>Hostilia</em> at Ostiglia and ran north to <em>Tridentum</em>. The eastern one began at <em>Altinum</em>, a port on the edge of the Venetian lagoon. It climbed through <em>Opitergium</em> at Oderzo and <em>Feltria</em> at Feltre before turning west to the same city. The two surviving milestones disagree about where the road began: the stone from Cesiomaggiore, near Feltre, counts 350 Roman miles from <em>Altinum</em> to the Danube, while the one from Rabland measures from the Po.</p><p>North of Trento the line followed the Adige past <em>Pons Drusi</em> in the Bolzano area and up the Val Venosta to the Reschen Pass. It came down the Inn towards Landeck, crossed the Fern Pass at 1,212 metres and reached <em>Foetes</em> at F\u00fcssen, where the Lech leaves the mountains.</p><p>On the Bavarian plain it kept to the Lech, passing <em>Abodiacum</em> at Epfach on the way to <em>Augusta Vindelicum</em>, the chief town of the province of Raetia. The survey also draws a spur west to <em>Cambodunum</em> at Kempten. Beyond Augsburg a last stretch probably ran on to the Danube near Mertingen, where it met the military road along the frontier.</p>",
		modern:
			"<p>Much of the line is still a road, because in the narrow Alpine valleys there is room for only one. In Italy the SS12 and the Brenner motorway share the Adige valley from Trento to Bolzano; the SS38 and SS40 carry on up the Val Venosta to the Reschen Pass. In Austria the B180 descends from Nauders through the Inn gorge towards Landeck and the B179 crosses the Fern Pass to Reutte. In Bavaria the B17, the southern end of the Romantic Road, runs from F\u00fcssen through Schongau and Landsberg to Augsburg, largely in the same corridor as the Roman line. These are valley routes rather than Roman surveying: modern engineers have tunnelled and straightened where the Romans climbed. The original roadbed usually lies beside the asphalt or under a farm track.</p>",
		seeing:
			"<p>The best piece of the road itself crosses the moor between Lermoos and Biberwier, below the Fern Pass. A timber causeway runs almost straight across the bog for about a kilometre and a half; excavations between 1992 and 1995 dated its logs to the winter of AD 45 to 46. The raised embankment still shows plainly in the fields. At Flie\u00df, above the Inn near Landeck, the <em>Via Claudia Augusta</em> documentation centre displays the Tyrolean finds alongside a copy of the <em>Tabula Peutingeriana</em>.</p><p>In South Tyrol a copy of the Rabland milestone stands outside the Hanswirt inn at Rabl\u00e0, near Merano; the original, found in 1552, is in the civic museum at Bolzano. At Kempten the Arch\u00e4ologischer Park Cambodunum shows the excavated temple precinct and baths of the Roman town.</p>",
		faq: [
			{
				q: "Who built the Via Claudia Augusta?",
				a: "Drusus, the stepson of Augustus, laid out the route during his conquest of the Alps in 15 BC. His son, the emperor Claudius, turned it into a paved road fit for wheeled vehicles and finished the work in AD 46 or 47, as two surviving milestones record.",
			},
			{
				q: "Where does the Via Claudia Augusta start and end?",
				a: "It ran from northern Italy to Augsburg and on towards the Danube. There were two southern starting points, Ostiglia on the Po and Altino near Venice. The branches met at Trento before crossing the Reschen and Fern passes.",
			},
			{
				q: "Can you cycle the Via Claudia Augusta?",
				a: "Yes. A signed cycle route of about 700 kilometres runs from Donauw\u00f6rth on the Danube to either Ostiglia or Venice. Shuttle buses carry riders and bikes over the Fern and Reschen passes for those who would rather not climb them.",
			},
		],
	},
	"via-traiana": {
		route:
			"<p>The road left <em>Beneventum</em> and crossed the Calore by the Ponte Valentino, then climbed north-east into the Apennines. Ruined bridges mark the ascent; the Ponte delle Chianche near Buonalbergo is the best known. It passed <em>Aequum Tuticum</em>, at Sant'Eleuterio near Ariano Irpino, and crossed the watershed close to the San Vito pass, some 947 metres up.</p><p>It came down to <em>Aecae</em> at Troia, on the edge of the Tavoliere, and ran east across the plain to <em>Herdoniae</em> near Ordona, crossing the Cervaro by a long bridge whose remains survive at Ponte Rotto. From there it crossed the Ofanto to <em>Canusium</em> at Canosa di Puglia.</p><p>Beyond Canosa it turned towards the sea through <em>Butuntum</em> at Bitonto. The survey then runs south-east to <em>Egnatia</em> near Fasano, a walled port town where the road reached the coast. It then follows the shore past <em>Ad Speluncas</em>, a road station whose name means 'at the caves', to <em>Brundisium</em>. Ancient sources also record a coastal variant through <em>Barium</em> at Bari, which the survey does not draw.</p>",
		modern:
			"<p>No single modern road follows the <em>Via Traiana</em>. Its mountain section fell out of use in the eighteenth century, replaced by the Bourbon highway known as the Via regia delle Puglie, the ancestor of today's SS90 from Benevento towards Foggia. The SS90 shares the Roman road's general direction through the Apennines but seldom its exact course.</p><p>On the plain, minor roads and farm tracks pick up stretches of the line between Troia, Ordona and Canosa, though few are signposted as Roman. Towards the end, the coastal dual carriageway between Fasano and Brindisi runs roughly parallel to the last leg, close to but not on the ancient alignment.</p>",
		seeing:
			"<p>Egnazia, near Fasano, is the best place to stand on the road. The Museo e Parco Archeologico di Egnazia keeps the excavated town behind its walls; the paved <em>Via Traiana</em> runs through the middle of it. At Herdonia, outside Ordona, Belgian excavations begun in 1962 uncovered a forum, a basilica, a circular market and baths set along the road, where wheel ruts are still visible in the stones.</p><p>At Benevento the Arch of Trajan, 15.6 metres high and built between 114 and 117, stands near the start of the road; one of the panels inside the passage shows the emperor sacrificing at its opening. Milestones survive at Bari, Trani and Ascoli Satriano. Another, marked LXXXI, 81 Roman miles, stands on a street corner in Cerignola.</p>",
		faq: [
			{
				q: "Who built the Via Traiana?",
				a: "The emperor Trajan, around 109. His milestones name the road from Benevento to Brindisi and state that he built it with his own money.",
			},
			{
				q: "How long is the Via Traiana?",
				a: "Roughly 300 km from Benevento to Brindisi. The line on this site's map measures about 294 km; ancient itinerary distances make it slightly longer than the Via Appia between the same two cities.",
			},
			{
				q: "What is the difference between the Via Appia and the Via Traiana?",
				a: "Both linked Benevento to Brindisi. The older Via Appia ran inland through Venosa and Taranto, over steep Apennine country; the Via Traiana took a northern line through Canosa to the Adriatic coast, with far fewer climbs, which made it the quicker journey despite a similar length.",
			},
		],
	},
	"via-belgica": {
		route:
			"<p>The surveyed line starts at <em>Bagacum</em>, capital of the Nervii, whose second-century forum is the largest yet found in Gaul. Several roads radiated from the town. This one heads east-north-east past stations the Peutinger Table names as <em>Vogdoriacum</em>, probably near Givry, then <em>Geminiacum</em> at Liberchies, then crosses the Hesbaye past Perwez to Tongeren. Distances here were reckoned in the Gaulish league of about 2.2 kilometres, not the Roman mile.</p><p><em>Atuatuca Tungrorum</em> grew up under Augustus as the chief town of the Tungri, settled in the territory after Caesar destroyed the Eburones. From Tongeren the survey runs east past Herderen to <em>Traiectum</em>, the crossing of the Maas at Maastricht. The Peutinger Table omits it and gives the stage straight to Heerlen, but Tacitus records a fight for the bridge here during the Batavian revolt.</p><p>Beyond the Maas the road climbs to <em>Coriovallum</em>, Heerlen, a roadside town at the junction with the road north to Xanten. It crosses the Wurm into Germany, reaches <em>Iuliacum</em> at J\u00fclich on the Rur, then crosses the Ville ridge and comes down into Cologne from the west.</p>",
		modern:
			"<p>In Wallonia long stretches survive as minor roads and farm tracks still signed Chauss\u00e9e Brunehaut or Chauss\u00e9e Romaine, holding the Roman alignment for kilometres at a time across open arable land. Between Tongeren and Maastricht the line is more fragmentary, kept by lanes and field boundaries and visible on nineteenth-century maps.</p><p>In Germany the eastern section is the best preserved: much of the stretch between J\u00fclich and Cologne is still a road. The exception is the Hambach open-cast lignite mine, which has erased the line between J\u00fclich and Elsdorf. At the Cologne end, from Weiden into the city, Aachener Stra\u00dfe follows the Roman course. Br\u00fcnestra\u00dfe in Baesweiler, west of J\u00fclich, keeps the old name.</p>",
		seeing:
			"<p>Tongeren makes the best base. The Gallo-Romeins Museum holds the finds of the town the Romans founded. Long runs of the second-century city wall still stand to the north and west. At Grand-Rosi\u00e8re-Hottomont, in the commune of Ramillies, the tumulus of Hottomont rises about ten metres beside the road: a Roman burial mound, probably of the second century, excavated in 1921.</p><p>At Bavay the Forum antique museum stands beside the excavated forum and its cryptoportico. In Heerlen the bath house of <em>Coriovallum</em>, among the best-preserved Roman buildings in the Netherlands, is shown under cover in the town's Roman museum, which is due to be rebuilt around it. J\u00fclich's Museum Zitadelle has a room given over to the road; the nearby Sophienh\u00f6he carries replica milestones.</p>",
		faq: [
			{
				q: "Why is it called the Via Belgica?",
				a: "The name is modern. Archaeologists began using it in the early twentieth century, after the Roman province of Gallia Belgica. No Roman source calls the road by it. Locally it is the Chauss\u00e9e Brunehaut in French and the Agrippastra\u00dfe in German.",
			},
			{
				q: "Is the Chauss\u00e9e Brunehaut a Roman road?",
				a: "Mostly, yes. The name comes from Brunhilda, a Frankish queen of the late sixth and early seventh centuries whom medieval legend credited with repairing the old roads, so it is attached to several Roman roads radiating from Bavay, this one included.",
			},
			{
				q: "How long was the Via Belgica?",
				a: "The stretch mapped here, from Bavay to Cologne, is about 260 kilometres. The full road continued west from Bavay through Cambrai and Arras to Boulogne-sur-Mer on the Channel coast, well over 400 kilometres in all.",
			},
		],
	},
	"via-nova-traiana": {
		route:
			"<p>The road left <em>Bostra</em>, the provincial capital. It ran south-west through the station of <em>Thantia</em> into what is now Jordan, a straight line across the basalt country east of Mafraq. It passed the road station at Khirbet es-Samra and the springs at Zarqa before reaching <em>Philadelphia</em>, the Decapolis city beneath modern Amman.</p><p>South of Amman it crossed the plateau through <em>Esbus</em> at Hesban, Madaba and <em>Dibon</em> at Dhiban, then went down into the Wadi Mujib, the Arnon of the Bible. It climbed out the far side. On the plateau of Moab came <em>Areopolis</em>, also called <em>Rabbathmoba</em>, at Rabba, then <em>Characmoba</em> at Kerak.</p><p>Beyond the Wadi Hasa the road climbed through <em>Thornia</em> and <em>Negla</em>, in the uplands near Shobak, to Petra, the old Nabataean capital. South of the city it crossed the high plateau by <em>Zodocatha</em> at Sadaqa and <em>Auara</em> at Humayma, a Nabataean town given a Roman fort, then followed the Wadi Yitm down to <em>Aila</em> on the Gulf of Aqaba.</p>",
		modern:
			"<p>Jordan's Highway 35, still signed for visitors as the King's Highway, follows the <em>Via Nova</em>'s corridor from Madaba through Dhiban, Kerak and Tafila to Shobak. It is the same route more than the same road: both go through the plateau towns and across the same canyons, but stretches of Roman paving survive off the asphalt, notably on the southern slopes of the Wadi Mujib and east of Shobak. North of Amman the main road through Zarqa and Mafraq runs close to the Roman line. Beyond Mafraq village streets sit directly on top of it as it heads for Bosra. In the far south the Desert Highway takes over, descending the Wadi Yitm to Aqaba as the Roman road did.</p>",
		seeing:
			"<p>The finest surviving stretch lies around the village of Ba'ij, about ten kilometres east-north-east of Mafraq. Here the paving runs for long distances towards the Syrian border, with a distinct later widening along its eastern edge. At least one group of milestones still stands where it was set up. Umm el-Jimal, the basalt Roman and Byzantine town, is a short drive away.</p><p>At the southern end, a Trajanic milestone from Khirbet al-Kithara in the Wadi Yitm is shown in the Aqaba Archaeological Museum. Humayma, a few kilometres off the Desert Highway, keeps the walls of its Roman fort. Petra and the Ancient City of Bosra are both UNESCO World Heritage Sites.</p>",
		faq: [
			{
				q: "Is the King's Highway in Jordan a Roman road?",
				a: "In part. The King's Highway is a much older route, mentioned in the Book of Numbers. The Romans rebuilt long stretches of its course as the Via Nova Traiana after AD 106. Today's Highway 35 follows the same corridor through Madaba, Kerak and Shobak, but it is a modern road laid beside or over the Roman one.",
			},
			{
				q: "Who built the Via Nova Traiana?",
				a: "It was built for the emperor Trajan by Gaius Claudius Severus, the first governor of the province of Arabia. Milestones dated AD 111 and 112 credit him with opening and paving it. The whole road is usually said to have been finished by AD 114.",
			},
			{
				q: "How long was the Via Nova Traiana?",
				a: "A little over 400 kilometres from Bosra in Syria to Aqaba on the Red Sea. The survey line drawn on this site's map measures about 455 kilometres.",
			},
		],
	},
	"via-sebaste": {
		route:
			"<p>The surveyed line begins at <em>Perge</em>, a few kilometres inland from the coast near Antalya, heading north across the plain towards the Taurus. The Roman road climbed the range by the pass known as <em>Climax</em>, the D\u00f6\u015feme Bo\u011faz\u0131, where a milestone near the summit is numbered 139 miles from <em>Antiochia</em>. Over the top it reached the colony of <em>Comama</em>, in what is now Burdur province.</p><p>From <em>Comama</em> the line runs north through the Pisidian lake country to <em>Apollonia</em> at Uluborlu, then east to <em>Antiochia</em> outside Yalva\u00e7. This was the <em>caput viae</em>, the head of the road, from which every mile was counted.</p><p>East of <em>Antiochia</em> the road skirted the Sultan Da\u011flar\u0131 past K\u0131yakdede, where a milestone marked XXX survives in the village mosque, and reached <em>Pappa Tiberiopolis</em> at Yunuslar. Lengths of roadbed survive near Yenido\u011fan and Sefak\u00f6y. It then came down into Lycaonia to <em>Iconium</em>, modern Konya, then turned south for some 30 kilometres to <em>Lystra</em> near Hatunsaray, another Augustan colony.</p>",
		modern:
			"<p>No modern road keeps to the <em>Via Sebaste</em> for long. The highway from Antalya to Burdur crosses the Taurus on its own line. An Ottoman carriage road of the late nineteenth century had already left the Roman pass, which is partly why the ancient roadbed in the D\u00f6\u015feme gorge survived. North of the mountains the roads linking Isparta, Uluborlu and Yalva\u00e7 cover much the same ground, though rarely on the Roman alignment.</p><p>East of Yalva\u00e7 the road towards Bey\u015fehir parts from the ancient route near Kireli. Beyond there the Roman line is easier to trace by its milestones and by the Seljuk caravanserais that later went up beside it than by any modern carriageway. <em>Iconium</em> itself lies beneath the centre of Konya.</p>",
		seeing:
			"<p>The D\u00f6\u015feme pass, north of Antalya, holds the finest surviving stretch: about two kilometres of Roman roadbed climbing some 250 metres, with the ruins of a late Roman roadside station and an Augustan milestone still in place near the summit. <em>Perge</em> keeps its Hellenistic gate towers and colonnaded street; many of its finds are in the Antalya Museum.</p><p>At <em>Antiochia</em>, outside Yalva\u00e7, visitors can see the city gate, the temple of Augustus and standing arches of the aqueduct. The Yalva\u00e7 Museum displays fragments of the <em>Res Gestae</em>, Augustus's own account of his reign, found in front of that temple. At Kilistra, near Lystra, a section of the road is cut straight into the bedrock.</p>",
		faq: [
			{
				q: "Why is it called the Via Sebaste?",
				a: "Sebastos is the Greek rendering of Augustus, so the name means the Augustan road. Milestones dated 6 BC record that Augustus built it through his governor Cornutus Aquila.",
			},
			{
				q: "Did St Paul use the Via Sebaste?",
				a: "Probably. Acts 13 and 14 take Paul and Barnabas from Perge to Antioch in Pisidia, then to Iconium and Lystra. The Via Sebaste was the Roman road linking those towns. The Bible never names the road.",
			},
			{
				q: "Can you walk the Via Sebaste?",
				a: "In places. The D\u00f6\u015feme pass north of Antalya has a well preserved stretch. The waymarked St Paul Trail runs about 500 kilometres from Perge to Yalva\u00e7, though it does not always keep to the Roman line.",
			},
		],
	},
};
