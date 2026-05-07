import type { Payload, PayloadRequest, RequiredDataFromCollectionSlug } from 'payload'

// ── Lexical helpers ───────────────────────────────────────────────────────────

function para(text: string) {
  return {
    children: [
      { detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    type: 'paragraph',
    version: 1,
  }
}

function richDoc(...paragraphs: string[]) {
  return {
    root: {
      children: paragraphs.map(para),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

// ── Tour data ─────────────────────────────────────────────────────────────────

interface TourStep {
  title: string
  description?: ReturnType<typeof richDoc>
}

interface TourSeed {
  title: string
  city: 'belgrade' | 'sarajevo'
  tourId: number
  lede: string
  duration: string
  priceGroup: number
  priceSolo: number
  includes: string
  introText?: ReturnType<typeof richDoc>
  steps?: TourStep[]
}

const TOURS: TourSeed[] = [
  // ── BELGRADE ──────────────────────────────────────────────────────────────

  {
    title: 'Rise & Fall of a Nation Tour',
    city: 'belgrade',
    tourId: 11,
    lede:
      'From the dawn of socialist Yugoslavia to its collapse in the 1990s, this ride will have you experiencing the communist era of Belgrade to its fullest.',
    duration: '4 hours',
    priceGroup: 65,
    priceSolo: 95,
    includes: 'Drink & Snack\nMuseum of Yugoslavia and Mausoleum of Tito',
  },

  {
    title: 'Architecture Tour: Brutalism in Socialist Yugoslavia',
    city: 'belgrade',
    tourId: 12,
    lede:
      "Rational living for the socialist man! Tour New Belgrade's most jaw-dropping reinforced concrete in a period-correct Yugoslav ride.",
    duration: '4 hours',
    priceGroup: 65,
    priceSolo: 95,
    includes: 'Drink & Snack',
  },

  {
    title: 'Belgrade Highlights Tour',
    city: 'belgrade',
    tourId: 13,
    lede:
      'Witness the city transform from its ancient Celtic origins at Kalemegdan, to medieval battles in Zemun, to the bold modernism of New Belgrade.',
    duration: '2 hours',
    priceGroup: 45,
    priceSolo: 75,
    includes: 'Drink & Snack',
  },

  {
    title: 'Tito Tour: The Man, the Myth, the Legend',
    city: 'belgrade',
    tourId: 14,
    lede:
      'Marshall Tito fathered the Second Yugoslavia and lived like a movie star—and commissioned the car that you will drive in his footsteps.',
    duration: '4 hours',
    priceGroup: 65,
    priceSolo: 95,
    includes: "Drink & Snack\nMuseum of Yugoslavia and Mausoleum of Tito\nTito's Blue Train",
  },

  {
    title: 'Grand Architecture Tour',
    city: 'belgrade',
    tourId: 15,
    lede:
      'Dig deep into the architectural jumble of Belgrade on this Grand Tour. See its landmarks and the rebuilt Avala Tower, a symbol of its resilience.',
    duration: '6–7 hours',
    priceGroup: 100,
    priceSolo: 150,
    includes: 'Drink & Snack\nEntrance to Avala Tower',
  },

  {
    title: '3 Wars Grand Tour: Traces of WW1, WW2 and the 1999 NATO Bombing',
    city: 'belgrade',
    tourId: 16,
    lede:
      "Witness the impact of the last three major wars on Belgrade. From WWI to the 1999 bombing, discover the city's strategic and tragic 20th century.",
    duration: '6–7 hours',
    priceGroup: 100,
    priceSolo: 150,
    includes:
      "Drink & Snack\nTito's Blue Train\nMuseum of Banjica Concentration Camp (if available)",
  },

  {
    title: 'Grand Yugotour',
    city: 'belgrade',
    tourId: 17,
    lede:
      "Venture past the city center to see Tito's hidden Blue Train, the peak of Mount Avala, and unique brutalist blocks rarely seen by visitors.",
    duration: '6–7 hours',
    priceGroup: 100,
    priceSolo: 150,
    includes: "Drink & Snack\nEntrance to Avala Tower\nTito's Blue Train",
  },

  // ── SARAJEVO ──────────────────────────────────────────────────────────────

  {
    title: 'Sarajevo Yugotour',
    city: 'sarajevo',
    tourId: 21,
    lede:
      "Drive a Yugo through Sarajevo's socialist past. Explore Olympic sites, brutalist blocks, and spomeniks—all set to a YU-ROCK soundtrack.",
    duration: '4 hours',
    priceGroup: 50,
    priceSolo: 75,
    includes: 'EX-YU Rock Center\nHistory Museum\nCiglane Funicular',
  },

  {
    title: 'Olympic Yugotour',
    city: 'sarajevo',
    tourId: 22,
    lede:
      "Sarajevo 1984 was Yugoslavia's proudest moment. Drive a Yugo to the iconic sports sites and bold architecture of the Games. Join us, comrade!",
    duration: '6 hours',
    priceGroup: 75,
    priceSolo: 100,
    includes: 'Olympic Museum',
  },

  {
    title: 'Brutalist Zenica Yugotour',
    city: 'sarajevo',
    tourId: 23,
    lede:
      "Discover Zenica's sixfold socialist growth. Tour the iron factory and modernist blocks built by, and for, the Yugoslav worker. Join the tour, comrade!",
    duration: '6 hours',
    priceGroup: 75,
    priceSolo: 100,
    includes: 'Coffee at Gradska Kafana',
  },

  {
    title: 'Neretva Yugotour',
    city: 'sarajevo',
    tourId: 24,
    lede:
      "Explore the forested mountains where Partisans fought and Tito hid his nuclear bunker. See the Neretva valley in a Yugo. Join us, comrade!",
    duration: '6 hours',
    priceGroup: 75,
    priceSolo: 100,
    includes: "Tito's Nuclear Bunker\nNeretva Battle Museum",
  },

  {
    title: 'Sutjeska Yugotour',
    city: 'sarajevo',
    tourId: 25,
    lede:
      "Explore the Valley of Heroes. See where Tito's forces broke the Axis line and visit the epic Sutjeska memorial complex on this unique tour.",
    duration: '8 hours',
    priceGroup: 100,
    priceSolo: 140,
    includes: 'Museum entrance\nNational Park entrance',
    introText: richDoc(
      'The Battle of Sutjeska in June 1943 was a true turning point in the war effort of the Yugoslav Partisans against the German-Italian occupiers during the Second World War. Marshall Tito and the Partisan main force once again managed to break through Axis encirclement, proving that they were a formidable fighting force that could not easily be defeated. The legacy of this battle became a key component in post-war Yugoslav identity, and to that end a large memorial complex was built in the Sutjeska valley. Join this Yugotour to explore the wartime history and post-war legacy of the Battle of Sutjeska.',
    ),
    steps: [
      {
        title: 'About the Tour',
        description: richDoc(
          'This full-day tour takes you on board a vintage YUGO car for a deep dive into the wartime history and post-war legacy of the Battle of Sutjeska. The tour starts with a scenic, 2-hour drive to the Valley of Heroes, where we visit the Sutjeska Museum and the Tjentište Spomenik Memorial, which are both magnificent examples of brutalist architecture. Thereafter we go on a safari of the highlights of the Sutjeska National Park.',
        ),
      },
      {
        title: 'Starting Point',
        description: richDoc(
          'The tour can start at your accommodation or at any other preferred spot in Sarajevo. Just let us know in your booking and the YUGO will pick you up as agreed.',
        ),
      },
      {
        title: 'Tjentište Spomenik Monument',
        description: richDoc(
          'The massive concrete Tjentište Monument was designed by the notable Yugoslav architect Miodrag Živković to honour the heroic war efforts of the Partisans in the Battle of Sutjeska. The opening between its two 19m tall concrete wings represents the Partisan breakthrough out of Axis encirclement. In the Yugoslav era, this monument was considered the most significant WWII memorial in the country, attracting hundreds of thousands of visitors a year.',
        ),
      },
      {
        title: 'Sutjeska Memorial House',
        description: richDoc(
          'The Memorial House next to the Tjentište Monument features an impressive modernist design with pointed roofs of concrete and glass which resemble either mountain tops or shepherd huts from the surrounding area. Its architect was the Montenegrin Ranko Radović, and inside we find 13 frescoes by the Croatian artist Krsto Hegedušić, depicting battle scenes among the names of exactly 7,356 fallen Partisan soldiers. Your guide explains the frescoes and translates the inscriptions in the museum.',
        ),
      },
      {
        title: 'Battle of Sutjeska Museum',
        description: richDoc(
          'The exhibition that used to be housed in the basement of the Memorial House has been moved to a separate building after its partial destruction in the Bosnian War of the 1990s. Among the surviving exhibits, we find Partisan and Axis uniforms and weapons, along with an explanation of the main events of the Battle of Sutjeska.',
        ),
      },
      {
        title: 'Youth Camp Tjentište',
        description: richDoc(
          'In the Yugoslav era, Tjentište was visited by thousands of organized excursions of schoolchildren, youth brigades, and the pioneer Yugoslav youth movement. The memorial complex served not only as a monument to past sacrifices but also as an outdoor classroom to actively teach the Yugoslav vision of a new society, free of fascism and ethnic tension, in the spirit of brotherhood and unity. To accommodate pupils, the complex was equipped with a campsite, a youth hotel, and an enormous outdoor swimming pool.',
        ),
      },
      {
        title: 'National Park Sutjeska',
        description: richDoc(
          'As a socialist brochure from the 1980s states about the Sutjeska National Park: "here every piece of soil, every stone—is a monument". The entire Sutjeska area was established as Bosnia-Herzegovina\'s oldest national park in 1962, with the Zelengora mountains on the west bank and the Perućica primeval forest and Mount Maglić on the east side. Throughout this protected area of wild nature, another 79 monuments remind us of the Sutjeska Battle, and we visit the most significant ones.',
        ),
      },
      {
        title: 'Miljevina Motel',
        description: richDoc(
          'En route back to Sarajevo, we make an urban explorer stop at the devastated brutalist-style Miljevina Motel. On the road to Tjentište, at the outskirts of Miljevina, this roadside motel was built as a later expansion of the hospitality infrastructure for the Sutjeska National Park. During the Bosnian War of the 1990s this building was used as the headquarters of the Miljevina Crisis Committee, which was responsible for war crimes at this location and in the wider area.',
        ),
      },
    ],
  },

  {
    title: 'Siege of Sarajevo Yugotour',
    city: 'sarajevo',
    tourId: 26,
    lede:
      'From frontline positions to the Tunnel of Hope, explore the history of the Siege of Sarajevo and the tragic collapse of the Yugoslav federation.',
    duration: '4 hours',
    priceGroup: 55,
    priceSolo: 80,
    includes: 'Historical Museum\nTunnel Museum',
  },
]

// ── Seed function ─────────────────────────────────────────────────────────────

export async function seedTours({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> {
  payload.logger.info('— Seeding tours...')

  for (const tour of TOURS) {
    const existing = await payload.find({
      collection: 'tours',
      where: { tourId: { equals: tour.tourId } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      payload.logger.info(`  Skipping "${tour.title}" — already exists.`)
      continue
    }

    await payload.create({
      collection: 'tours',
      data: tour as unknown as RequiredDataFromCollectionSlug<'tours'>,
      req,
    })

    payload.logger.info(`  Created "${tour.title}"`)
  }

  payload.logger.info('— Tours seeded.')
}
