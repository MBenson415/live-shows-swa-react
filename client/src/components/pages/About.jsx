function About() {
  return (
    <div className="page-container about-page">
      <div className="about-image-container">
        <img
          src="https://squarespacemusic.blob.core.windows.net/$web/sevenpillars.jpg"
          alt="Seven Pillars"
          className="about-image"
        />
        <span className="about-image-text">MARSHALL BENSON</span>
      </div>
      <h2>Who is Marshall Benson?</h2>
      <div className="about-layout">
        <div className="about-content">
          <p>
            Marshall Benson is a 25-year lead guitar player, bass player, and recording engineer / producer.
            He is obsessed with tone and articulation; with melody and theme central to his creative style.
            His die was cast in early 90's grunge—buzzsaw guitars and pounding drums are his life-blood,
            but he has a cerebral love for late-80's experimental and instrumental rock.
            <br /><br />
            Marshall produces original music in the prog-pop electronic duo Midnight Maniac with songwriting
            counterpart Jake Curt Allard, tours on lead guitar duty with in the southern and western United
            States with hard rock outfit Christian Shields, and holds down low-end duties with electric bass
            for Texas alt-punks FM Rodeo.
            <br /><br />
            He is an independent music producer offering local Austin artists quality recording and mix
            engineering (with session musician and co-writing duties included) working out of his home
            studio Peregrine Engineering. He has a deep network of referrals to award-winning producers
            and mastering engineers in the central Texas area to help bring artist recording quality
            appropriate for radio and streaming platforms.
            <br /><br />
            Additionally, Marshall works out of an independent luthier shop specializing in solid-body
            instrument setup, electronics repair, and floating bridge installation / set-up.
          </p>
        </div>
        <div className="about-side-image">
          <img
            src="https://squarespacemusic.blob.core.windows.net/$web/fmrodeorobo.jpg"
            alt="Marshall Benson"
          />
        </div>
      </div>
    </div>
  );
}

export default About;