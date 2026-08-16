/**
 * Hand-written content for the /roads/britain/[county] pages.
 *
 * A county page is only published when it has BOTH enough mapped segments to
 * be worth a map and an entry here naming at least one road you can read about
 * on this site. That rule is deliberate: the Itiner-e survey attributes only
 * six British roads by name, so a county with no named road and thirty
 * anonymous segments would be a map, two numbers and nothing else. Better no
 * page than a thin one.
 *
 * `roads` are /road/<slug> keys, so each county page distributes links to the
 * road pages that actually cross it.
 *
 * Server-only, like road-detail.ts and region-notes.ts.
 */
export type CountyNote = {
	/** Story keys for the named roads crossing this county. */
	roads: string[];
	note: string;
	/** Somewhere specific to go and look, so the page is not a map and two numbers. */
	seeing: string;
};

export const COUNTY_NOTES: Record<string, CountyNote> = {
	yorkshire: {
		roads: ["ermine-street", "dere-street", "stainmore-pass", "ryknild-street"],
		note: "Yorkshire was the military heart of northern Britain. <em>Eboracum</em> at York began as a legionary fortress in AD 71, became the capital of Britannia Inferior when the province was divided, and was where both Septimius Severus and Constantius Chlorus died — Constantine was proclaimed emperor in the city on the second occasion. Ermine Street came north to it and Dere Street ran on from it toward the frontier, so almost every Roman road in the county is oriented on York. Westward, the Stainmore road carried traffic over the Pennines to Cumbria.",
		seeing:
			"York keeps the multangular tower of the legionary fortress in the Museum Gardens and a Roman column standing opposite the Minster, whose undercroft shows the fortress <em>principia</em> beneath it. Aldborough has mosaics in situ, and the Roman road over Blackstone Edge above Littleborough, paved and grooved down its centre, is the most argued-over stretch of Roman paving in the country.",
	},
	hertfordshire: {
		roads: ["watling-street", "ermine-street", "akeman-street", "icknield-way"],
		note: "Hertfordshire has an unusual density of Roman road because three major routes leave London through it. <em>Verulamium</em> at St Albans was one of the largest towns in Roman Britain and the junction where Watling Street met Akeman Street; Boudica's army sacked it in AD 60 or 61, and the town rebuilt on a grander scale afterward. Ermine Street runs up the east of the county toward Braughing, and the prehistoric Icknield Way crosses the north along the chalk.",
		seeing:
			"Verulamium Park at St Albans has the town walls, the London Gate, a hypocaust under cover and the only Roman theatre visible in Britain, across the road on private land but open to visitors. The Verulamium Museum holds the mosaics lifted from the town.",
	},
	cambridgeshire: {
		roads: ["ermine-street", "via-devana", "king-street", "icknield-way"],
		note: "Cambridgeshire's Roman roads are shaped by water. The fens were drained and farmed on a large scale under Rome, crossed by causeways and by the Car Dyke, a major artificial watercourse. Ermine Street ran north through <em>Durovigutum</em> at Godmanchester to <em>Durobrivae</em> at Water Newton, a pottery town whose kilns supplied much of the province. The road east from Cambridge toward Colchester is the best-attested part of what antiquaries later named the Via Devana.",
		seeing:
			"The Roman town at Godmanchester sits under the modern one, but the Car Dyke is traceable north of Cambridge, and the road over the Gog Magog hills survives as a chalk track with long views. The Water Newton treasure, the earliest known hoard of Christian liturgical silver from anywhere in the Roman empire, was found beside the road here and is now in the British Museum.",
	},
	buckinghamshire: {
		roads: ["akeman-street", "watling-street", "icknield-way"],
		note: "Buckinghamshire sits where Watling Street and Akeman Street diverge north-west of London, and where both cross the Chilterns. <em>Durocobrivis</em> at Dunstable, just over the Bedfordshire line, marked the point at which Watling Street crossed the Icknield Way, a junction of the new road system with the old. Long green-lane stretches of Akeman Street survive across the county and are walkable in a day.",
		seeing:
			"The villa at Bancroft in Milton Keynes has its foundations laid out and interpreted in a public park, with a mosaic under cover. Verulamium's material is over the county line at St Albans, but the small town at Fleet Marston near Aylesbury and the temple site at Thornborough, with its two Roman burial mounds beside the road, are both Buckinghamshire's own.",
	},
	lincolnshire: {
		roads: ["ermine-street", "fosse-way", "king-street"],
		note: "<em>Lindum</em> at Lincoln was a legionary fortress and then a <em>colonia</em>, a chartered town for retired soldiers, and it is where the Fosse Way and Ermine Street meet. The Newport Arch, at the north end of Bailgate, still spans the line of Ermine Street. North of the city the A15 runs on the Roman alignment almost all the way to the Humber, and King Street offered a second, lower route through the fen edge to the south.",
		seeing:
			"Beyond Lincoln itself, the fort and small town at Ancaster sit where King Street rejoins Ermine Street, and the Car Dyke runs south from the city as a Roman earthwork you can follow on foot. The Collection in Lincoln holds the county's Roman material, including the tombstones recovered from the colonia walls.",
	},
	gloucestershire: {
		roads: ["fosse-way", "akeman-street", "ryknild-street"],
		note: "<em>Corinium Dobunnorum</em> at Cirencester was the second largest town in Roman Britain and a hub where the Fosse Way, Akeman Street and Ermin Way converged. The Cotswolds around it hold one of the densest concentrations of Roman villas in the country, Chedworth among them, built on the wealth of the wool and grain trade the roads carried. The A429 still runs fast and straight along the Fosse Way across the plateau.",
		seeing:
			"Cirencester's Corinium Museum has one of the best mosaic collections in Britain, and the town's amphitheatre survives as a grassy hollow on its western edge. Chedworth Roman Villa, in a wooded Cotswold valley nearby, is a National Trust site with mosaics, bath suites and a spring shrine.",
	},
	cumbria: {
		roads: ["high-street", "maiden-way", "stanegate", "military-way", "stainmore-pass"],
		note: "Cumbria's Roman roads are frontier roads, and several are the most exposed in Britain. High Street crosses the Lakeland fells above seven hundred metres, higher than any other Roman road in England, though not every archaeologist accepts the whole line as Roman. The Maiden Way climbs the Pennines to Hadrian's Wall and served the lead and silver mines of Alston Moor. The Stanegate runs east to west below the wall, and the Stainmore road connects the county eastward to Dere Street and York.",
		seeing:
			"Hardknott Fort, on its shelf above Eskdale, is the most dramatically sited Roman fort in Britain and reached by one of its steepest roads. Ravenglass has the bath house walls standing four metres high, and the High Street ridge is a full day's walk on the road itself.",
	},
	bedfordshire: {
		roads: ["watling-street", "icknield-way"],
		note: "Watling Street runs the length of Bedfordshire on its way north-west from <em>Verulamium</em>, passing <em>Durocobrivis</em> at Dunstable where it crosses the Icknield Way. That crossroads is the clearest place in Britain to see the two systems meet: a prehistoric ridge track that had been in use for millennia, and a Roman road driven straight across it by an army in a hurry.",
		seeing:
			"Dunstable sits on the crossroads of Watling Street and the Icknield Way, and the line of both is legible in the modern street plan. Totternhoe, just west, was quarried for the chalk-stone the Romans used in local building.",
	},
	london: {
		roads: ["watling-street", "ermine-street", "stane-street", "devils-highway"],
		note: "<em>Londinium</em> was founded around AD 47 as a trading settlement at the lowest bridgeable point of the Thames, and the road network was built to converge on that bridge. Boudica burned the city in AD 60 or 61, leaving the layer of scorched red clay archaeologists still find across the City. Watling Street, Ermine Street, Stane Street and the road west to Silchester all radiate from the crossing, and the modern street plan still preserves their lines: Edgware Road, Bishopsgate and Kennington Park Road are all Roman alignments.",
		seeing:
			"The Temple of Mithras is the one to see: displayed beneath a modern office building close to its original site, reconstructed with the light and sound of the cult, and free. The city's Roman collection is between homes — the Museum of London closed in 2022 and its successor, the London Museum, opens at Smithfield in late 2026. Sections of the city wall stand at Tower Hill and near the Barbican, and the amphitheatre's outline is marked in the floor of the Guildhall Art Gallery.",
	},
	oxfordshire: {
		roads: ["akeman-street", "icknield-way"],
		note: "Akeman Street crosses Oxfordshire from east to west, running from Alchester near Bicester through the Windrush valley toward Cirencester. The county was villa country: North Leigh and Ditchley were substantial estates working the good ground either side of the road. Long stretches of Akeman Street survive as green lane and bridleway rather than tarmac, which is why they are still legible.",
		seeing:
			"North Leigh Roman Villa has a fine mosaic under cover and free access, and the green-lane stretches of Akeman Street between Kirtlington and Ramsden are quiet walking. The Ashmolean in Oxford holds material from across the county.",
	},
	suffolk: {
		roads: ["pye-road", "icknield-way"],
		note: "The Pye Road ran north through Suffolk from <em>Camulodunum</em> at Colchester to <em>Venta Icenorum</em> near Norwich, crossing the Stour and the Waveney and passing the small town at Coddenham. The A140 still follows it, which is why it runs so much straighter than the lanes either side. The road existed to bind the defeated Iceni to the colony that symbolised Roman power in the region.",
		seeing:
			"Burgh Castle, on the Norfolk border, has the walls of a Saxon Shore fort standing to full height on three sides. Nearer the road, the small town at Coddenham and the crossing at Scole have both been extensively excavated, and Ipswich Museum holds the finds.",
	},
	kent: {
		roads: ["watling-street", "stone-street"],
		note: "Kent is where Roman Britain begins. The invasion force of AD 43 landed on this coast, and <em>Rutupiae</em> at Richborough, the bridgehead, carried a great four-way triumphal arch marking the formal entrance to the province. Watling Street ran from it through <em>Durovernum Cantiacorum</em> at Canterbury to London, and Stone Street struck south from Canterbury to the Saxon Shore fort and harbour at Lympne. The A2 and the B2068 still follow those two lines.",
		seeing:
			"Richborough is the essential visit: the invasion beachhead, the foundations of the great arch and the walls of the later Saxon Shore fort, all in the care of English Heritage. Lullingstone Roman Villa has mosaics and a Christian house-church, and the B2068 south from Canterbury is Stone Street to drive.",
	},
	powys: {
		roads: ["sarn-helen"],
		note: "Roman Powys was crossed rather than settled. Sarn Helen, the chain of roads running the length of Wales, passes through the county, and the forts along it — Caersws, Castell Collen, Y Gaer near Brecon — were garrison posts holding a route rather than towns. The Roman interest in mid Wales was mineral and military: get through it, hold the passes, and reach the coast.",
		seeing:
			"Y Gaer, the fort west of Brecon, has visible walls and gateways in a farmed landscape. Caersws in the upper Severn valley was a garrison town on the road through mid Wales, and the Roman marching camps on the moors above are visible from the air and traceable on the ground.",
	},
	essex: {
		roads: ["pye-road", "via-devana"],
		note: "<em>Camulodunum</em> at Colchester was the first Roman capital of Britain and the site of the temple of the deified Claudius, which the Iceni burned in AD 60 or 61 with its defenders inside. The colony was refounded and the road network rebuilt around it: north to Venta Icenorum by the Pye Road, west toward Cambridge, and south-west to London. Colchester still has the longest surviving stretch of Roman town wall in Britain.",
		seeing:
			"The Balkerne Gate is the largest surviving Roman gateway in Britain and stands at the western end of the town wall. Colchester Castle is built directly on the vaults of the temple of Claudius, which you can go down into, and the Roman circus, the only one known in the country, is marked out south of the town centre with a visitor centre on the site.",
	},
	northamptonshire: {
		roads: ["watling-street"],
		note: "Watling Street runs diagonally across Northamptonshire, and the stretch of the A5 that follows it through the county is the clearest surviving demonstration of Roman surveying in England: mile after mile of straight road across gently rolling ground. <em>Lactodorum</em> at Towcester was the posting station on it, and Bannaventa near Norton another. The M1 was built to relieve this road, not to replace it.",
		seeing:
			"The A5 through the county is Watling Street to drive, mile after mile of it. Towcester keeps the line of the Roman town in its street plan, and the villa at Piddington, excavated over decades by a local society, has a small museum in the village.",
	},
	somerset: {
		roads: ["fosse-way"],
		note: "The Fosse Way crosses Somerset from <em>Lindinis</em> at Ilchester toward <em>Aquae Sulis</em> at Bath, where the hot springs and the temple of Sulis Minerva made one of the most visited sites in Roman Britain. The Mendips were mined for lead on an industrial scale from within a few years of the invasion, and lead pigs stamped with imperial names travelled out along this road. The clearest surviving <em>agger</em> is in the fields near Radstock.",
		seeing:
			"Bath is unmissable: the Roman Baths are the best-preserved Roman religious spa complex north of the Alps, with the spring, the great bath and the temple pediment of Sulis Minerva. Charterhouse on Mendip has the earthworks of the lead-mining settlement and a small amphitheatre.",
	},
	dorset: {
		roads: ["ackling-dyke"],
		note: "Ackling Dyke crosses Cranborne Chase toward <em>Durnovaria</em> at Dorchester, and preserves one of the finest Roman road earthworks in Britain: an <em>agger</em> up to fifteen metres wide, standing nearly two metres above the fields and walkable for several kilometres near Badbury Rings. Dorset was hard-won country — Vespasian, then a legionary legate, reduced its hillforts in the campaigns after AD 43, Maiden Castle among them.",
		seeing:
			"Dorchester keeps the only fully exposed Roman town house in Britain, behind County Hall, with mosaics and a hypocaust under cover and free access. Maiden Castle, the largest hillfort in the country, is a short walk from the town, and the Roman aqueduct that fed <em>Durnovaria</em> can be traced as a terrace along the Frome valley.",
	},
	norfolk: {
		roads: ["peddars-way", "pye-road", "icknield-way"],
		note: "Norfolk was Iceni territory, and its Roman roads are the roads of an occupation. Peddars Way was laid out after Boudica's revolt was crushed in AD 61, driving straight through the tribal heartland to the north coast. <em>Venta Icenorum</em> at Caistor St Edmund replaced the tribal centre; because it was never built over, the full circuit of its walls and its street grid survive as earthworks in open fields.",
		seeing:
			"Burgh Castle on the coast has the walls of a Saxon Shore fort standing to full height on three sides, and Caister-on-Sea keeps the foundations of a second Roman port. Inland, the Peddars Way between Castle Acre and Fring is the emptiest and most Roman-feeling stretch of the whole trail.",
	},
	derbyshire: {
		roads: ["ryknild-street"],
		note: "Roman Derbyshire was lead country. The orefield of the White Peak was worked from the first century, and lead pigs stamped <em>Lutudarum</em> have been found across the province and beyond. Ryknild Street runs north through the county on a line the A38 still largely follows, and the fort at Little Chester near Derby guarded the crossing of the Derwent.",
		seeing:
			"Little Chester, on the edge of Derby, has the fort site marked and interpreted. Buxton was <em>Aquae Arnemetiae</em>, one of only two Roman spa towns in Britain, and Derby Museum holds the lead pigs and mining material that explain why the roads came here at all.",
	},
	gwynedd: {
		roads: ["sarn-helen"],
		note: "<em>Segontium</em>, the fort at Caernarfon, held the north-western corner of the empire for three centuries, and Sarn Helen ran south from it through the mountains. Some of the clearest surviving stretches of Roman mountain road anywhere in Wales are here, on the moors above Ffestiniog near the fort at Tomen y Mur, where the <em>agger</em> is plain as a raised band in the turf across empty ground.",
		seeing:
			"Tomen y Mur is the outstanding site: a fort with an amphitheatre, parade ground and bath house in wholly empty moorland, with a Norman motte dropped into the middle of it. Caer Llugwy in the Lledr valley and the marching camps on the Migneint are for the determined; Caernarfon's fort is the easy one, laid out beside the road in the care of Cadw.",
	},
	northumberland: {
		roads: ["dere-street", "devils-causeway", "stanegate", "military-way"],
		note: "Northumberland was the far edge of the empire for three centuries, and its roads exist to hold that edge. Dere Street runs north through it and over the Cheviots into Scotland; the Devil's Causeway branches off to the coastal plain; the Stanegate and the Military Way run east to west behind and along Hadrian's Wall. The wall itself, begun around AD 122, is a UNESCO World Heritage Site, and the fort and civilian settlement at Vindolanda produced the writing tablets that are the best evidence anywhere of ordinary Roman life.",
		seeing:
			"Housesteads and Vindolanda are the two essential forts, and the wall between Steel Rigg and Housesteads is the finest surviving stretch, with the Military Way, the Vallum and the wall all visible at once. At Corbridge Roman Town the excavated street you walk down the middle of the site is the Stanegate, with Dere Street passing just to the west.",
	},
	staffordshire: {
		roads: ["watling-street", "ryknild-street"],
		note: "<em>Letocetum</em> at Wall, near Lichfield, is the reason Staffordshire matters here: it is where Watling Street and Ryknild Street crossed at right angles, and the excavated bath house and <em>mansio</em> beside the junction are among the best-preserved roadside buildings in Britain. Travellers on the road to Wroxeter and the Welsh frontier stopped, bathed and changed horses on this spot.",
		seeing:
			"Wall is National Trust land in English Heritage guardianship, with a small site museum of the finds. Further north, Rocester and Chesterton were forts on Ryknild Street, and the Staffordshire Hoard, though Anglo-Saxon, was found in a field beside Watling Street and is displayed in Stoke-on-Trent and Birmingham.",
	},
	leicestershire: {
		roads: ["fosse-way", "watling-street"],
		note: "<em>Venonis</em> at High Cross, on the county's southern edge, is where the Fosse Way crosses Watling Street — traditionally called the centre of Roman Britain, and marked by a battered eighteenth-century monument. <em>Ratae Corieltauvorum</em> at Leicester was the tribal capital and keeps the Jewry Wall, one of the tallest pieces of Roman masonry standing in the country.",
		seeing:
			"The Jewry Wall Museum reopened in 2025 around the excavated baths, with the wall itself standing nine metres high beside them. At High Cross, on the Warwickshire border, a battered eighteenth-century monument marks the crossing of the Fosse Way and Watling Street in an otherwise unremarkable field.",
	},
	devon: {
		roads: ["fosse-way"],
		note: "<em>Isca Dumnoniorum</em> at Exeter was a legionary fortress from about AD 55 and the western terminus of the Fosse Way. Devon marks a limit in more than one sense: west of Exeter the Roman road network thins to almost nothing, and the far south-west stayed a place Rome traded with rather than settled. Exeter's Roman city wall still runs for much of its circuit.",
		seeing:
			"Exeter's Roman city wall survives for most of its circuit and is walkable, and the Royal Albert Memorial Museum holds the material from the legionary fortress beneath the modern city. The Fosse Way begins here, and it is a long way to Lincoln.",
	},
	hampshire: {
		roads: ["devils-highway"],
		note: "<em>Calleva Atrebatum</em> at Silchester sits in the north of the county and is one of the most remarkable Roman sites in Britain: a walled town abandoned after the Roman period rather than built over, so the full circuit of its walls and its amphitheatre stand in open farmland with a footpath round them. The Devil's Highway ran west to it from London, and roads radiated from Calleva in every direction.",
		seeing:
			"Park at the church inside the walls, walk the full circuit through farmland, and find the amphitheatre outside the east gate. Reading Museum holds the finds, including the Silchester eagle. Elsewhere in the county, Portchester Castle near Portsmouth has the most complete Roman fort walls in northern Europe, standing to their full height with a Norman keep inside.",
	},
	cheshire: {
		roads: ["via-devana"],
		note: "<em>Deva Victrix</em> at Chester was one of three permanent legionary fortresses in Britain, home to the Twentieth Legion, and the roads of Cheshire converge on it. Its amphitheatre is the largest known in the country, and the modern city walls still follow the Roman circuit along two sides. The supposed Via Devana takes its name from Deva, though whether it ever ran here as one road is another matter.",
		seeing:
			"The amphitheatre, the largest known in Britain, is half-excavated beside the city walls and free to walk into. The Grosvenor Museum holds the tombstones recovered from the city wall, where the Romans' own memorials had been reused as building stone, and the Roman Gardens display columns and hypocaust pillars from the fortress baths.",
	},
};
