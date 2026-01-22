function Projects() {
  const activeProjects = [
    {
      id: 1,
      name: 'Midnight Maniac',
      bandImage: 'https://squarespacemusic.blob.core.windows.net/$web/Midnight+Maniacswm+(4+of+8).webp',
      logo: 'https://squarespacemusic.blob.core.windows.net/$web/midnightmaniac.png',
      url: 'https://midnightmaniac.net',
      description: 'Midnight Maniac is a progressive pop act that combines electronic and upbeat hard rock elements to create a fresh and darkly compelling sound. Established in 2023 in Austin, TX by Jake Allard and Marshall Benson, the multi-instrumentalist duo shares songwriting duties; with Allard taking on lead vocals and Benson helming lead guitar and studio production.\n\nUnsatisfied with traditional rock \'n roll, Midnight Maniac emerges as a beacon of change with an energetic and adventurous departure from the predictable, often indulging in unexpected key signature and time changes while delivering memorable hooks; Allard\'s catchy vocal delivery is well-complemented by Benson\'s signature precision guitar attack, taking the listener on an auditory ride that is laden with fantastic imagery that delves into hyper-conscious realms, lyrically touching on aspects of dreams, the extra-terrestrial, and a rich inner world.\n\nMusic fans who crave more substance than the saccharine diet that pure pop provides, but who find progressive rock too tedious or pretentious will find a satisfying balance in Midnight Maniac\'s imaginative offering which often expertly oscillates between intense instrumental passages and uplifting vocal melodies.'
    },
    {
      id: 2,
      name: 'Christian Shields',
      bandImage: 'https://squarespacemusic.blob.core.windows.net/$web/marshallptrs.png',
      logo: 'https://squarespacemusic.blob.core.windows.net/$web/christianshields.png',
      url: 'https://christianshields.net',
      description: 'Christian Shields is an American musician, multi-instrumentalist, singer, songwriter, and producer from Warwick, Rhode Island. He now hails from Austin, Texas and has played over 300 shows in the United States with various groups (Last One Standing, Dreamer, Shields) and opening for bands such as Hawthorne Heights, Candlebox, Saving Abel, Saliva, John 5, Hollywood Undead, All That Remains, Jackyl, The Treatment, Lynch mob, Oleander, and many others.\n\nChristian teamed up with multi-platinum award winning producer/engineer Kevin "131" Gutierrez has launched a solo career. Christian released his first single "Rock and Roll" on September 27th, 2019. Two more singles followed; "Not This Time" on November 29th, 2019 and "Lie to Me" on January 17th, 2020. Christian\'s debut album "This Is Rock \'N\' Roll" was released on March 13th, 2020 worldwide via his own vanity label, Shields records.'
    },
    {
      id: 3,
      name: 'Droplift',
      bandImage: 'https://squarespacemusic.blob.core.windows.net/$web/droplifttracks.webp',
      logo: 'https://squarespacemusic.blob.core.windows.net/$web/droplift.jpg',
      description: 'Droplift was founded in the early 2010\'s by songwriters Tony Zamora (vocals, guitar) and Angus Barrs (vocals, bass) and added Marshall Benson in 2018 on lead guitar and production duties. The band brought a unique style to the post-grunge sound, with intertwining vocal harmonies soaring (Zamora / Barrs) over buzzsaw rhythm guitars and searing leads (Benson). The group released singles "Blurred", "Faith", and "Mistaken" all recorded and mixed at Peregrine Engineering in South Austin, and played a handful of gigs backed by drummers Jordan Goldman and Bailey Moates.\n\nThe group broke up in 2019 with Zamora spinning off a primarily acoustic solo project that continues to create new music and perform in Austin and the greater central Texas area, but is rebooting in 2026 with new drummer Jon Renner, with single releases planned and new shows on the books in Central Texas.'
    },
    {
      id: 4,
      name: 'FM Rodeo',
      bandImage: 'https://squarespacemusic.blob.core.windows.net/$web/fmrodeoband.webp',
      logo: 'https://squarespacemusic.blob.core.windows.net/$web/fmrodeo.jpg',
      description: 'Based out of the Hill Country in central Texas, FM Rodeo started in 2015 when Troy Dry (vocals/guitars) and Johnny Elrod (Drums) began recording the Machine Shop sessions.\n\nElements of grunge, punk and alternative music can be heard in their tracks, often compared to Green Day, Nirvana, Oasis, Amyl and The Sniffers, Together, Pangea Microwave, Radkey, Murdocks, Local H, The Toadies and The Libertines Wavves.\n\nMarshall joined on bass duties in the Spring of 2023, providing an electrifying live element and bottom end groove to a set of new recordings and invigorating live performances.'
    },
    {
      id: 5,
      name: 'Peregrine',
      bandImage: 'https://squarespacemusic.blob.core.windows.net/$web/peregrinestudio.webp',
      logo: 'https://squarespacemusic.blob.core.windows.net/$web/peregrinelogo.webp',
      url: 'https://soundcloud.com/peregrine2183',
      description: 'Peregrine 2183 is a studio project envisioned by Marshall Benson in 2013; his approach hybridized the popular style of Synthwave with overdubbed electric guitar leads and solos. Often described as thematic and at times cinematic, the experimental style was crafted to stimulate imagery in the listener\'s visual mind, often with fantastical subjects ranging from outer space to futuristic cybernetics.\n\nThe music featured 80\'s style drum machines and synthesizers, and highly-effected layered guitars. One listener described the music as the nostalgia-laden "ending scene credits to an 80\'s action cop movie".\n\nPeregrine is always lurking, and still releases demos and creative snippets to SoundCloud as an always-on creative outlet for its creator.'
    }
  ];

  const pastProjects = [
    {
      id: 6,
      name: 'King Cherry',
      bandImage: 'https://squarespacemusic.blob.core.windows.net/$web/kingcherryband.webp',
      logo: 'https://squarespacemusic.blob.core.windows.net/$web/kingcherrylogo.webp',
      description: 'King Cherry (Phoenix, AZ, est. 2024) is songwriter and vocalist Brian Jenning\'s unique combination of 90\'s-style alternative rock, punk, and pop (with a touch of metal) with a heavy focus on catchy hooks. Jennings has impressive credits in the LA rock scene of the early-90\'s (guitarist for Tommy Thayer\'s Shake The Faith, and Closure) and brings songs which have been brewing for up to a decade into the light of day with King Cherry.\n\nKing Cherry\'s frontman is supported by a stellar backline of rock musicians who deliver a driving backbeat to the catchy hooks: Rachel Bello on bass, Arturo Sosa on drums, and Marshall Benson on lead guitar and backing vocals.'
    },
    {
      id: 7,
      name: 'TWOTRUTHS',
      bandImage: 'https://squarespacemusic.blob.core.windows.net/$web/2T band.webp',
      logo: 'https://squarespacemusic.blob.core.windows.net/$web/2Tlogo.webp',
      description: 'TWOTRUTHS was founded in 2017 under Sebastian Cazares\' (songwriting, vocals, guitar) leadership with two former members of First Year Fight following on: Marshall Benson on lead guitar and Jacob Delagarza on bass. The lineup was rounded out by Lindsay Bailey\'s precision cannon-fire attack on drums.\n\n2T\'s musical foundation is unmistakably pop-punk, but with clear distinguishing elements, namely Cazares\' crooning vocals and genre-bending influences in hard rock and emo, and Benson\'s lead work which featured melodic riffs and solo sections uncharacteristic of the average pop-punk guitar player.\n\n2T\'s 2021 flagship release "Flourish" featured a modern production that showcases all the most powerful aspects of the group\'s abilities.\n\nTWOTRUTHS rocked stages and house shows in Austin, San Antonio, and New Braunfels. In 2023 they acquired new members and plan to release new music and continue to tour.'
    },
    {
      id: 8,
      name: 'First Year Fight',
      bandImage: 'https://squarespacemusic.blob.core.windows.net/$web/firstyearfightband.webp',
      logo: 'https://squarespacemusic.blob.core.windows.net/$web/fyflogo.webp',
      description: 'First Year Fight was founded in 2016 by hard-working drummer Ryan Woodruff, who recruited Austin-area locals Devon "Sunshine" Salmon (lead vocals), Marshall Benson (lead guitar), Sebastian Cazares (guitar, backup vocals), and Jacob Delagarza (bass) to the cause. The group quickly gained traction in the local scene after tracking a 3-track EP at Westfall Studies in North Austin. The style featured a classic pop-punk approach with influence from Paramore, Blink-182, Acceptance, Yellowcard, and All-Time Low.\n\nThe group split up in 2017 to pursue other creative avenues.'
    }
  ];

  return (
    <div className="page-container projects-page">
      <h2>Projects</h2>

      <div className="projects-section">
        <h3 className="projects-section-header">Active Projects</h3>
        <div className="projects-content">
          {activeProjects.map(project => (
            <div key={project.id} className="project-item">
              <div className="project-band-image">
                <img src={project.bandImage} alt={`${project.name} band`} />
              </div>
              <div className="project-info">
                <div className="project-logo">
                  {project.url ? (
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      <img src={project.logo} alt={`${project.name} logo`} />
                    </a>
                  ) : (
                    <img src={project.logo} alt={`${project.name} logo`} />
                  )}
                </div>
                <div className="project-description">
                  {project.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                  {project.url && (
                    <p className="project-link">
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        Visit {project.name}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="projects-section">
        <h3 className="projects-section-header">Past Projects</h3>
        <div className="projects-content">
          {pastProjects.map(project => (
            <div key={project.id} className="project-item">
              <div className="project-band-image">
                <img src={project.bandImage} alt={`${project.name} band`} />
              </div>
              <div className="project-info">
                <div className="project-logo">
                  <img src={project.logo} alt={`${project.name} logo`} />
                </div>
                <div className="project-description">
                  {project.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;