/**
 * Modern British roads that follow a Roman line, for /modern-roads.
 *
 * Deliberately ONE page rather than a page per road number. "Is the A5 a Roman
 * road?" and its siblings are real queries, but twelve near-identical pages of
 * two paragraphs each would compete with the road pages that already answer
 * those questions in the FAQ, and with each other. One page that answers the
 * whole family, and links out to the road page for each, is the stronger
 * structure and the more useful one.
 *
 * `road` is the /road/<slug> key, so every entry doubles as an internal link.
 * Server-only: imported by the route's +page.server.ts, not by the app.
 */
export type ModernRoad = {
	/** The modern designation, as people search for it. */
	number: string;
	/** The Roman road it follows. */
	roman: string;
	/** Slug of the /road/<slug> page, when there is one. */
	road?: string;
	/** Where the correspondence holds. */
	between: string;
	/** How close the modern road runs to the Roman line. */
	fidelity: "close" | "partial" | "loose";
	note: string;
};

export const MODERN_ROADS: ModernRoad[] = [
	{
		number: "A5",
		roman: "Watling Street",
		road: "watling-street",
		between: "London and Shrewsbury",
		fidelity: "close",
		note: "The best known case and among the most faithful. For long stretches across Northamptonshire and Warwickshire the modern carriageway sits within a few metres of the Roman surveying, which is why it runs straight for miles at a time. Thomas Telford rebuilt the road as the London to Holyhead mail route from 1815, finishing with the Menai Bridge in 1826, and largely kept the Roman line because it was already the best one available.",
	},
	{
		number: "A2",
		roman: "Watling Street",
		road: "watling-street",
		between: "Dover and London",
		fidelity: "close",
		note: "The Kentish half of Watling Street, carrying traffic from the Channel ports to London as it has since the invasion. The road still bears the name on signs through Bexleyheath and Dartford.",
	},
	{
		number: "B2068",
		roman: "Stone Street",
		road: "stone-street",
		between: "Canterbury and Lympne",
		fidelity: "close",
		note: "One of the most faithful survivals anywhere in Britain. The B2068 follows Stone Street almost exactly for around twenty kilometres over the North Downs and still carries the Roman road's name, though the last stretch down to Lympne is on minor roads.",
	},
	{
		number: "A15",
		roman: "Ermine Street",
		road: "ermine-street",
		between: "Lincoln and the Humber",
		fidelity: "close",
		note: "One of the straightest stretches of road in the country. A 1950s dogleg takes it round RAF Scampton a few miles north of Lincoln, but beyond that it runs across flat farmland towards the Humber with barely a bend. If you want to feel what Roman surveying was like, drive this.",
	},
	{
		number: "A1198",
		roman: "Ermine Street",
		road: "ermine-street",
		between: "Royston and Godmanchester",
		fidelity: "close",
		note: "Signposted as Ermine Street along its length, and a more honest survival of the Roman road than the A1 that gets the credit.",
	},
	{
		number: "A1",
		roman: "Ermine Street",
		road: "ermine-street",
		between: "London and Yorkshire, intermittently",
		fidelity: "partial",
		note: "Commonly called a Roman road, and only partly one. The A1 descends from the medieval Great North Road, which used Ermine Street where convenient and left it where it was not. The two lines diverge repeatedly, most obviously north of Lincoln where the Roman road runs dead straight to the Humber and the A1 does not.",
	},
	{
		number: "A46",
		roman: "Fosse Way",
		road: "fosse-way",
		between: "Leicester and Lincoln",
		fidelity: "close",
		note: "The northern third of the Fosse Way. Between Lincoln and Ilchester the road never strays more than about ten kilometres from a straight line drawn between the two, which is the most quoted fact about Roman Britain, and this is the stretch where a modern driver can most easily feel it.",
	},
	{
		number: "A429",
		roman: "Fosse Way",
		road: "fosse-way",
		between: "Cirencester and Moreton-in-Marsh",
		fidelity: "close",
		note: "The Cotswold section, running fast and straight across the plateau in a way no medieval road does. Several villages along it are named Fosse or Foss for the road they sit on.",
	},
	{
		number: "A37 and A367",
		roman: "Fosse Way",
		road: "fosse-way",
		between: "Ilchester and Bath",
		fidelity: "partial",
		note: "The Somerset stretch, where the Roman line is picked up and dropped repeatedly by modern roads. The clearest surviving earthwork here is off the tarmac altogether, in the fields near Radstock.",
	},
	{
		number: "A68",
		roman: "Dere Street",
		road: "dere-street",
		between: "Corbridge and the Scottish border",
		fidelity: "close",
		note: "The A68's sudden crests and dips across Northumberland are a direct consequence of Roman surveyors holding a straight alignment over rolling ground rather than contouring around it, and it is the most dramatic Roman road in the country to drive.",
	},
	{
		number: "A38",
		roman: "Ryknild Street",
		road: "ryknild-street",
		between: "Burton-on-Trent and Derby",
		fidelity: "close",
		note: "North of Burton the road runs almost dead straight for a long stretch up the Trent valley, where level ground made the original surveying easy.",
	},
	{
		number: "A140",
		roman: "Pye Road",
		road: "pye-road",
		between: "Needham Market and Norwich",
		fidelity: "partial",
		note: "The Roman road between Colchester and Venta Icenorum. The A140 runs north from Needham Market to Cromer and follows the Roman line along parts of that route, which is why it runs so much straighter than the Suffolk lanes either side of it.",
	},
	{
		number: "A29",
		roman: "Stane Street",
		road: "stane-street",
		between: "Billingshurst and Pulborough",
		fidelity: "partial",
		note: "The A29 follows Stane Street through several long stretches of West Sussex, leaving and rejoining the Roman line more than once. The best-preserved parts of the road are the sections no modern road took, over Bignor Hill and through Eartham Wood.",
	},
	{
		number: "A66",
		roman: "Stainmore Pass road",
		road: "stainmore-pass",
		between: "Scotch Corner and Penrith",
		fidelity: "close",
		note: "Not so much a road following a Roman one as both roads answering the same question. Stainmore is the lowest crossing of the northern Pennines, so the Romans took it and so does the A66. It closes in winter storms for the reasons it always has.",
	},
	{
		number: "A41",
		roman: "Akeman Street",
		road: "akeman-street",
		between: "Tring and Bicester",
		fidelity: "partial",
		note: "The A41 picks up Akeman Street near Tring and follows it loosely towards Bicester. West of there the Roman road survives as green lanes rather than tarmac.",
	},
	{
		number: "A69",
		roman: "Stanegate",
		road: "stanegate",
		between: "Corbridge and Carlisle",
		fidelity: "loose",
		note: "The A69 shares the Tyne-Irthing corridor with the Stanegate but takes the easier valley-bottom course where the Roman road held higher ground. Note that the nearby Military Road, the B6318, is an eighteenth-century road built on top of Hadrian's Wall, not a Roman road at all.",
	},
];

export const FIDELITY_LABEL: Record<ModernRoad["fidelity"], string> = {
	close: "Follows closely",
	partial: "Follows in parts",
	loose: "Same corridor",
};
