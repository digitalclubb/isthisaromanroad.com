/**
 * Hand-written notes for the country pages.
 *
 * These exist so the country pages are not thirty-one templated shells with
 * the numbers swapped. Each says something true and specific about Roman roads
 * in that country: which province it was, what the network was for, which
 * roads matter. Server-only, like road-detail.ts, so none of it reaches the
 * client bundle.
 *
 * House style as elsewhere: British English, no em dashes, no Oxford commas,
 * no comma before "and". Latin names in <em>.
 *
 * REGION_EXTRA carries a second paragraph for the countries where the survey
 * attributes no road by name. Those pages would otherwise be a map, three
 * numbers and eighty words, which is the shape Google's helpful-content system
 * exists to demote — and a demotion is site-wide, not page-wide. Countries
 * that clear neither bar (a named road, or enough segments to be substantial)
 * get no page at all. Better no page than a thin one.
 */
export const REGION_NOTES: Record<string, string> = {
	france:
		"Roman Gaul was the most heavily roaded province outside Italy itself, and France carries more mapped Roman road than any other modern country in this survey, narrowly ahead of Turkey. The backbone was laid by Agrippa in the 20s BC, radiating from <em>Lugdunum</em> at Lyon to the Rhine, the Atlantic, the Channel and the Mediterranean. In the south the <em>Via Domitia</em> is older still: cut in 118 BC to link Italy to Spain, it is the earliest Roman road in Gaul and long stretches of it survive in Languedoc and Provence.",

	turkey:
		"Asia Minor was crossed by Roman roads from the second century BC onward, and Turkey holds the second largest share of this survey after France. The <em>Via Sebaste</em> was built under Augustus in 6 BC to police the Pisidian highlands; the <em>Via Tauri</em> carried traffic through the Cilician Gates, the pass that every eastern campaign from Alexander onward had to force. The eastern end of the <em>Via Egnatia</em> reached the Bosporus, tying the whole system back to Rome.",

	spain:
		"Rome took its first Spanish provinces in 197 BC, after Sicily and Sardinia but well before Gaul, and the road network reflects two centuries of conquest. The <em>Via Augusta</em> ran nearly fifteen hundred kilometres from the Pyrenees to Cadiz, the longest road in Hispania and arguably a system rather than a single route. Inland, the road the Spanish call the <em>Vía de la Plata</em> ran north from Seville to Astorga, serving the gold mines of the north-west that made Hispania the richest mining province Rome ever held.",

	italy:
		"This is where the system began. The <em>Via Appia</em>, begun in 312 BC by the censor Appius Claudius Caecus, is the road all the others descend from, and the Romans called it <em>regina viarum</em>, the queen of roads. The <em>Via Aurelia</em> and the <em>Via Flaminia</em> followed it out of the city, until the proverb about all roads leading to Rome was a matter of engineering rather than metaphor. Not all of them did: the <em>Via Postumia</em> of 148 BC runs clean across the north from Genoa to Aquileia without touching the capital.",

	greece:
		"The great road of Roman Greece is the <em>Via Egnatia</em>, driven across the Balkan peninsula in the 140s BC from the Adriatic coast to Thessalonica and eventually Byzantium. It was the land route between Rome and the east, and armies used it in both directions for six centuries. Older sacred ways, like the road from Athens to Eleusis, were absorbed into the network rather than replaced.",

	algeria:
		"Roman Africa was a grain province, and its roads were built to move it. The network of <em>Numidia</em> and <em>Mauretania Caesariensis</em> linked the coastal ports to the inland cities of the high plains, and to the <em>limes</em>, the frontier road along the desert edge that watched the routes in from the Sahara. The remains at Timgad and Djemila stand in some of the best preserved Roman townscapes anywhere.",

	tunisia:
		"Ancient <em>Africa Proconsularis</em> was the richest province in the western empire after Italy, and Tunisia's density of Roman road reflects that. Roads radiated from Carthage, refounded as a Roman colony under Caesar in 44 BC and settled by Augustus, to Ammaedara, Thysdrus and the olive country of the Sahel. The bones of the network are still visible from the air as straight lines across the steppe.",

	bulgaria:
		"Bulgaria sits on the Roman route between the Danube frontier and the Aegean. The <em>Via Militaris</em>, the military road from Singidunum at Belgrade through Serdica at Sofia to Byzantium, was the empire's main artery into the eastern Balkans, and the road along the Danube supplied the legionary fortresses that held the river line for four centuries.",

	germany:
		"Roman roads in Germany serve a frontier. Most lie west and south of the <em>limes Germanicus</em>, the fortified line that ran from the Rhine to the Danube, and their job was to move troops along it and supplies to it. The <em>Via Belgica</em> came east from Boulogne through Cologne; the <em>Via Claudia Augusta</em> came north over the Alps to the Danube. Beyond the limes Rome laid no paved highways, though cleared campaign routes ran east of the Rhine up the Lippe valley, and an excavated Roman road survives at Dorsten-Holsterhausen.",

	egypt:
		"Egypt was the empire's granary and Rome's roads there were built to extract from it. The <em>Via Hadriana</em> ran along the Red Sea coast, and the desert roads from the Nile to the ports at Myos Hormos and Berenice carried the Indian Ocean trade in spice, ivory and pepper inland. Chains of fortified wells, the <em>hydreumata</em>, made the crossings possible at all.",

	romania:
		"Roman Dacia was conquered by Trajan in AD 106 and abandoned barely one hundred and seventy years later, which makes its road network unusually easy to date. The roads were driven north from the Danube to the gold mines of the Apuseni mountains, the wealth that paid for Trajan's Column and his forum at Rome.",

	belgium:
		"The <em>Via Belgica</em> is the road that defines Roman Belgium, running east from the Channel at Boulogne through Bavay and Tongeren towards Cologne and the Rhine. It carried the traffic between the British provinces and the German frontier, and long sections in Limburg are still followed by modern roads and field boundaries.",

	croatia:
		"Roman Dalmatia's roads had to cross one of the hardest coastlines in the empire, threading between the Adriatic and the Dinaric mountains. The network was laid out from Salona near Split, the provincial capital, with routes inland to the Sava valley and the Pannonian plain. Diocletian, born in the province, retired to his palace at Split at the end of one of them.",

	netherlands:
		"Almost every Roman road in the Netherlands relates to the <em>limes</em>, the Rhine frontier that marked the edge of the empire. The <em>Limesweg</em> ran along the river's south bank linking the forts from the North Sea inland, built on causeways and pile foundations through ground that was mostly water. It forms part of the Lower German Limes, inscribed as a UNESCO World Heritage Site in 2021.",

	syria:
		"Roman Syria was the empire's frontier with Parthia and later Persia, and its roads carried both armies and the caravan trade. The <em>Strata Diocletiana</em> ran along the desert edge from the Euphrates towards Damascus, a fortified road watching the steppe. Palmyra grew rich as the point where the desert crossing met the Roman road system.",

	portugal:
		"Roman <em>Lusitania</em> was governed from <em>Emerita Augusta</em> at Mérida, just over the modern border, and Portugal's roads mostly run towards it. Routes linked the Atlantic ports at Olisipo, modern Lisbon, and Bracara Augusta at Braga to the interior. The Roman bridges of the north, several still carrying traffic, are the most visible survivals.",

	serbia:
		"Serbia sits at the junction of two Roman arteries: the Danube frontier road, and the <em>Via Militaris</em> running south-east from Singidunum at Belgrade towards Byzantium. The stretch through the Iron Gates gorge was cut into the rock face and carried on timber galleries, one of the most ambitious pieces of road engineering the Romans attempted anywhere.",

	libya:
		"The cities of Roman Tripolitania, Leptis Magna, Oea and Sabratha, grew rich on the trans-Saharan trade, and the roads inland ran to the desert oases that made it possible. Leptis Magna was the birthplace of the emperor Septimius Severus, who rebuilt it on a scale the province could not sustain and which is why so much of it survives.",

	israel:
		"Roman <em>Iudaea</em> was intensively roaded after the revolts of AD 66 and 132, when Rome decided the province needed permanent military control. The roads run between the governor's seat at Caesarea Maritima, the legionary fortresses at Jerusalem and Legio near Megiddo and the frontier forts. Israel has one of the highest densities of surviving Roman milestones anywhere in the empire.",

	austria:
		"Roman Austria spanned <em>Noricum</em>, valued for its iron, and the western part of <em>Pannonia</em>. The <em>Via Claudia Augusta</em> crossed the Alps from Italy to the Danube, and the Danube road linked the Pannonian legionary fortresses at Vindobona, modern Vienna, and Carnuntum. Marcus Aurelius spent his last years on that frontier and died on it.",

	"bosnia-and-herzegovina":
		"The Roman roads of Bosnia climbed inland from the Dalmatian coast towards the Sava and the Pannonian plain, crossing the Dinaric mountains by the few passes that allow it. They served the silver and lead mines of the interior, which were worked under imperial control and were a significant part of what made the province worth holding.",

	jordan:
		"The <em>Via Nova Traiana</em> is the defining Roman road of Jordan, built between AD 111 and 114 to run the length of the new province of <em>Arabia Petraea</em> from Bostra to the Red Sea at Aila. It followed the line of the far older King's Highway, and it carried the incense trade north from Arabia through Petra.",

	hungary:
		"Roman Hungary was the Transdanubian part of <em>Pannonia</em>, and its roads exist to serve the Danube frontier. The limes road ran along the river past the legionary fortresses at Aquincum, now within Budapest and later the capital of Pannonia Inferior, and Brigetio, while the amber route ran south from the Baltic through Savaria to Italy, carrying a trade older than Rome itself.",

	cyprus:
		"Cyprus was a senatorial province from 22 BC, wealthy from copper; the metal takes its name from the island. Roman roads linked the coastal cities of Paphos, Salamis and Kition, and the Peutinger Table, a medieval copy of a late-antique road map, records the circuit of the island in some detail.",

	albania:
		"Albania holds the western end of the <em>Via Egnatia</em>, which began at the Adriatic ports of Dyrrachium at Durrës and Apollonia and climbed inland towards Macedonia. Travellers from Italy crossed the strait from Brundisium and picked up the road here, which makes this coast the hinge between the Roman west and the Greek east.",

	"north-macedonia":
		"The <em>Via Egnatia</em> crossed what is now North Macedonia on its way from the Adriatic to Thessalonica, passing Lake Ohrid and Heraclea Lyncestis near Bitola. It was the road that made the southern Balkans a corridor rather than a barrier, and it stayed in use through the Byzantine and Ottoman centuries.",
};

/**
 * Second paragraph for any country whose note alone would leave the page thin.
 * Each names specific places a reader can go and look at, rather than
 * restating the note. Originally added for the countries where the survey
 * names no road at all; extended to every page that was landing under about
 * 250 words of visible text.
 */
export const REGION_EXTRA: Record<string, string> = {
	spain:
		"The most complete thing to see is the bridge at Alcántara over the Tagus, built in AD 106 under Trajan and still standing, with its dedicatory arch and the inscription of its architect Caius Julius Lacer. Mérida keeps a Roman bridge of sixty arches, a theatre and an aqueduct; the gold workings at Las Médulas, where whole hillsides were washed away by water brought in by aqueduct, are a UNESCO World Heritage Site and among the most extraordinary industrial landscapes Rome left anywhere.",
	algeria:
		"Timgad is the place to understand what these roads were for. Founded by Trajan around AD 100 as a colony for veterans, it was laid out as a near-perfect grid on the standard military plan, and because it was abandoned rather than built over, that grid survives complete: the decumanus, the forum, the library, the arch of Trajan and a theatre for 3,500 people, all sitting where the surveyors put them.",
	tunisia:
		"The amphitheatre at El Djem, ancient Thysdrus, is the clearest measure of what the road network carried. Built in the third century to hold perhaps 35,000 people in a town that was never large, it was paid for by the olive oil that moved out along these roads to Rome. Dougga, further inland, preserves an entire small Roman city on its hillside.",
	bulgaria:
		"Plovdiv, ancient Philippopolis, sits on the <em>Via Militaris</em> and keeps a Roman theatre still used for performances, along with a stadium buried under the modern shopping street. At Hisarya the town walls survive to their full height in places, and the Roman road stations along the route to Byzantium are traceable across the Thracian plain.",
	romania:
		"Sarmizegetusa Regia in the Orăștie Mountains, the Dacian capital Trajan destroyed, and Colonia Ulpia Traiana Sarmizegetusa, the Roman city built to replace it, sit at either end of the story the roads were built to serve. The gold-mining galleries at Roșia Montană, cut with Roman tools and preserving wooden waterwheels, are the reason Dacia was worth conquering at all.",
	croatia:
		"Diocletian's palace at Split is the single most complete piece of late Roman architecture anywhere: not a ruin but the core of a living city, with medieval and modern houses built into and onto the imperial walls. The amphitheatre at Pula, further north, is among the six largest surviving, and Salona outside Split was the provincial capital the Dalmatian road network was laid out from.",
	portugal:
		"Conímbriga, near Coimbra, is the best-preserved Roman town in Portugal, with mosaics and a working fountain system still in place, and it sits on the road between Olisipo and Bracara Augusta. Évora keeps a Corinthian temple standing in its main square, and the Roman bridges of the Minho in the far north still carry local traffic.",
	serbia:
		"Felix Romuliana at Gamzigrad, the fortified palace Galerius built in his birthplace, is a UNESCO World Heritage Site and a reminder that four Roman emperors were born in what is now Serbia. Along the Danube, Trajan's Table is cut into the rock of the Iron Gates gorge, marking the road his engineers carried on timber galleries above the river.",
	libya:
		"Leptis Magna is the most complete Roman city in the Mediterranean and the reason to care about Libya's roads. Septimius Severus, born there in AD 145, rebuilt his home town on an imperial scale it never needed: a forum, a basilica, a four-way arch and a harbour that silted up almost as soon as it was finished. Sabratha keeps a three-storey theatre facade rebuilt in the 1930s.",
	"bosnia-and-herzegovina":
		"The Roman remains here are mostly small and rural, which is itself the point: this was a mining and transit province, not an urban one. Mogorjelo near Čapljina preserves a fortified late-Roman estate, and the mosaics at Stolac and the villa at Višići show the wealth that moved along the roads inland from the Dalmatian coast.",
	hungary:
		"Aquincum, in the Óbuda district of Budapest, has a museum built around the excavated civil town, complete with an amphitheatre and the reconstructed pipes of a Roman water organ found on the site. Gorsium at Tác and the Danube forts along the limes fill in the rest, and the amber route south towards Italy is traceable across Transdanubia.",
	cyprus:
		"The mosaics in the Houses of Dionysos, Theseus and Aion at Nea Paphos are among the finest in the eastern Mediterranean and sit within a UNESCO World Heritage Site. Salamis on the east coast keeps a gymnasium, baths and a theatre, and the two were joined by the coastal road the Peutinger Table records.",
	greece:
		"Sections of the <em>Via Egnatia</em> are visible near Kavala and in the Pindus passes, and the milestones recovered along it carry the names of the emperors who repaired the road across four centuries. Philippi, where the road passes the battlefield of 42 BC and where Paul founded his first European congregation, is a UNESCO World Heritage Site and the best single place to stand on it.",
	netherlands:
		"The limes is easiest to see at Nijmegen, the oldest city in the country and the site of a legionary fortress, and at Utrecht, where the outline of the fort of Traiectum is marked in the paving of Domplein. Waterlogged ground along the old Rhine has preserved things dry sites lose: Roman barges, timber road foundations and the wooden writing tablets that come with them.",
	germany:
		"Trier, <em>Augusta Treverorum</em>, was an imperial capital and keeps the Porta Nigra, an amphitheatre, imperial baths and a basilica that is still a working church. The Saalburg near Bad Homburg is a fort on the limes reconstructed on its excavated foundations, and the limes itself, running 550 kilometres from the Rhine to the Danube, is a UNESCO World Heritage Site.",
	belgium:
		"Tongeren is the oldest town in Belgium and sits squarely on the <em>Via Belgica</em>; its Gallo-Roman Museum is built over the remains and a stretch of the second-century town wall still stands. At Bavay, just across the French border, the forum complex is among the largest excavated anywhere in the north-western provinces.",
	austria:
		"Carnuntum, east of Vienna, is the outstanding site: parts of the civil town have been rebuilt full-size on their own foundations, so you can walk into a heated Roman house rather than look at a floor plan. Magdalensberg in Carinthia preserves the Norican trading settlement that handled the province's iron, and the Danube limes is a UNESCO World Heritage Site.",
	syria:
		"Palmyra's colonnaded street, its tetrapylon and the temple of Bel made it the most spectacular Roman city in the Levant, though much was destroyed after 2015. Apamea keeps a colonnade nearly two kilometres long, and Bosra in the south has a Roman theatre preserved inside a later Arab citadel, which is why it survives almost complete.",
	israel:
		"Caesarea Maritima has an aqueduct running along the beach, a theatre and the harbour Herod built with hydraulic concrete shipped from Italy. Beit She'an, ancient Scythopolis, is the most complete Roman city in the country, flattened by an earthquake in AD 749 and excavated much as it fell, with its colonnaded streets and bath house still legible.",
	jordan:
		"Jerash is among the best-preserved Roman provincial cities anywhere: an oval forum, two theatres, a colonnaded cardo with the ruts of Roman cartwheels still cut into the paving. Milestones of the <em>Via Nova Traiana</em> survive along the desert highway south, and Umm el-Jimal in the basalt country to the north-east is an almost intact late-Roman town.",
	egypt:
		"The Red Sea road ends at Berenike and Myos Hormos, where excavation has turned up peppercorns from India and Tamil graffiti, evidence of a trade route that ran from the Nile to the Malabar coast. Inland, the imperial quarries at Mons Claudianus and Mons Porphyrites were worked for the granite and porphyry that went into buildings in Rome, and the roads that served them still have their watchtowers.",
	albania:
		"Butrint, in the far south, is a UNESCO World Heritage Site with a Greek theatre, Roman houses and a baptistery mosaic, set in a lagoon landscape that has kept it isolated. Apollonia and Durrës hold the western terminals of the <em>Via Egnatia</em>; Durrës has the largest amphitheatre in the Balkans, found in the 1960s under a hillside of houses.",
	"north-macedonia":
		"Heraclea Lyncestis, on the edge of Bitola, sits directly on the <em>Via Egnatia</em> and keeps a theatre and a set of fifth-century basilica mosaics that are among the finest in the region. Stobi, further north at the meeting of the Erigon and the Axios, was the capital of Macedonia Secunda and preserves a theatre, streets and a synagogue beneath a later church.",
};
