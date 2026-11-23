/* the authored posts. thirty of them. after that, the tide writes. */
(function (GE) {
  'use strict';

  const you = (text) => ({ who: 'you', when: '{time}', text, you: true });

  GE.POSTS = [
    /* ---------------- stage 0: the tidepool ---------------- */
    {
      title: 'greetings, earth!',
      date: 'sunday, june 3, 2007', time: '2:14 pm', mood: '☀ sunny-ish', music: 'Hiroshi Yoshimura — Music for Nine Postcards',
      cat: 'tidepool news',
      body: `<p>hi! welcome to my little tidepool. i'm <b>minnow</b>. i finally moved off my old free host (rip, fourteen popup ads per page) and built this place by hand in notepad over three weekends and one very long rainy tuesday.</p>
<p>what goes here: old games (mostly the weird ones nobody finished), manga i reread every summer, sounds recorded near water, and pixel stuff i make when i should be sleeping.</p>
<p>the first resident of the tidepool is <b>Professor Gill</b>. he lives just below. click the water to drop food. he is a gentleman and will share with the tetras, eventually.</p>
<div data-toy="aquarium"></div>
<p>house rules: be nice, sign the guestbook (coming soon!!), and scroll slowly. there's no rush. nothing here is going anywhere.</p>`,
      comments: [
        { who: 'sakura_fishy', when: 'june 3', text: 'OMG the fish!!! linked u on my buttons page ✿' },
        { who: 'dial-up-dan', when: 'june 4', text: 'hand-coded in notepad. respect. it loads in 9 seconds on my 56k, which is a record for anything with this many fish' }
      ]
    },
    {
      title: 'drifting: LSD Dream Emulator',
      date: 'thursday, june 7, 2007', time: '11:02 pm', mood: '☁ dreamy', music: 'Boards of Canada — Music Has the Right to Children',
      cat: 'games',
      body: `<p><i>LSD: Dream Emulator</i> came out in 1998, in Japan only, and it is, as far as i can tell, a game about walking. you wake up inside a dream and walk until you touch something, and touching it moves you to a different dream. that's it. there's no goal. at the end of each "day" it plots your dream on a little chart with two axes (upper/downer, static/dynamic) and nobody really knows what the chart means.</p>
<div class="figure"><canvas data-sprite="dreamgraph" data-scale="3"></canvas><span class="fig-cap">my chart from last night's session, redrawn by hand</span></div>
<p>i love it because it doesn't want anything from me. most games are a list of chores with a soundtrack. LSD is a hallway that keeps becoming a different hallway.</p>
<p>it's based on a dream diary one of the developers kept for about ten years. sometimes the textures are just photographs. and sometimes a gray man in a hat appears, and if he touches you, the game quietly erases that day from your memory. i think about him a lot, honestly. he's the closest thing the game has to a rule.</p>
<p>tip: if you play it before bed, put the controller down before you fall asleep. i didn't, and dreamed about hallways all night. good hallways though.</p>`,
      comments: [
        { who: 'mossbat', when: 'june 8', text: "the gray man is the scariest thing in any game and he never does anything. that's the trick" },
        { who: 'kappa_kun', when: 'june 8', text: 'i got the kissing-head dream like 6 times in a row once' }
      ]
    },
    {
      title: 'a playlist for wet afternoons',
      date: 'tuesday, june 12, 2007', time: '4:40 pm', mood: '☂ rainy', music: 'Midori Takada — Through the Looking Glass',
      cat: 'sounds',
      body: `<p>it has rained every day this week, so here's what i've been listening to with the window cracked open:</p>
<ul class="tracklist">
<li><b>Hiroshi Yoshimura</b> — <i>Wet Land</i> (1993). the title track sounds like standing very still in a marsh at dawn.</li>
<li><b>Midori Takada</b> — <i>Through the Looking Glass</i> (1983). marimbas that move like water moving around a stone.</li>
<li><b>Satoshi Ashikawa</b> — <i>Still Way</i> (1982). made for the room. to be heard, not listened to.</li>
<li><b>Gigi Masin</b> — <i>Wind</i> (1986).</li>
<li><b>Chris Watson</b> — <i>Outside the Circle of Fire</i> (1998). not music, exactly. a hyena, a tree full of frogs, a hippo chewing. the most beautiful record i own.</li>
<li><b>Brian Eno</b> — <i>Ambient 4: On Land</i> (1982). a little spooky. for the end of the afternoon.</li>
</ul>
<p>i also made a little rain machine. none of this is recorded. it's all generated in your browser, so it never repeats. turn the sliders up slowly. the chimes are tuned to a pentatonic scale, so nothing can ever sound wrong.</p>
<div data-toy="mixer"></div>`,
      comments: [
        { who: '~pearl~', when: 'june 12', text: 'the chimes + rain at like 60% is my new homework setting' },
        { who: 'dial-up-dan', when: 'june 13', text: 'chris watson recorded a glacier once. it sounds like a building settling.' }
      ]
    },
    {
      title: 'the gentlest apocalypse',
      date: 'monday, june 18, 2007', time: '9:15 pm', mood: '☾ wistful', music: 'Hiroshi Yoshimura — Green',
      cat: 'manga',
      body: `<div data-toy="scene" data-scene="cafe"></div>
<p>i'm rereading <i>Yokohama Kaidashi Kikou</i> (Hitoshi Ashinano, 1994–2006) for maybe the fifth time. it's about Alpha, a robot who runs a little café on a quiet road outside Yokohama. the sea has risen. towns are underwater. streetlights stick up out of the bay like reeds, and some of them still come on at night. and nobody is panicking. it's long after the panic. people just live. they drink coffee, they ride scooters, they watch the evening come in.</p>
<p>i think it's the kindest version of the end of the world anyone has drawn. the water comes up so slowly that you can get used to it. every chapter it's a little higher, and every chapter it's a little more normal.</p>
<p>i want to live like that. slow enough to get used to anything.</p>`,
      comments: [
        { who: 'mossbat', when: 'june 19', text: 'this manga made me cry over a streetlight' },
        { who: 'sakura_fishy', when: 'june 19', text: "i wish someone would license it in english!! my scanlation is SO blurry" }
      ]
    },
    {
      title: 'meet bloop',
      date: 'thursday, june 21, 2007', time: '3:30 pm', mood: '♡ proud', music: 'Gigi Masin — Wind',
      cat: 'bloop',
      body: `<p>the tidepool has a new resident! this is <b>Bloop</b>. he's an axolotl. he's three days old (in website years). he likes being fed and being pet and he does not like being ignored, which i relate to.</p>
<div data-toy="pet"></div>
<p>axolotl facts: they can regrow almost any part of their body, including bits of their brain. they stay in their larval form their whole lives. their faces are stuck in a permanent smile, which i am personally very jealous of.</p>
<p>please be nice to him. he remembers.</p>`,
      comments: [
        { who: 'kappa_kun', when: 'june 21', text: 'BLOOP!!! i fed him 40 times sorry' },
        { who: '~pearl~', when: 'june 22', text: 'he winked at me' }
      ]
    },
    {
      title: 'fern study + a tiny painter',
      date: 'wednesday, june 27, 2007', time: '1:05 am', mood: '✎ focused', music: 'Satoshi Ashikawa — Still Way',
      cat: 'pixels',
      body: `<p>i've been doing little 16×16 studies of plants from the botanical garden greenhouse. limiting yourself to sixteen pixels square is good practice for deciding what actually matters about a thing. a fern is a curve, and a lot of smaller curves agreeing with it.</p>
<div class="sprite-row"><canvas data-sprite="leaf"></canvas><canvas data-sprite="fern"></canvas><canvas data-sprite="jelly"></canvas><canvas data-sprite="frog"></canvas></div>
<p>(the jellyfish isn't a plant. i got distracted in the aquarium gift shop.)</p>
<p>here's the little painter i use, same palette as the greenhouse. make something and keep it, or don't. it doesn't save. i think that's nice.</p>
<div data-toy="painter"></div>`,
      comments: [
        { who: 'sakura_fishy', when: 'june 27', text: 'the frog!!!!! can i use him as an avatar' },
        { who: 'minnow', when: 'june 27', text: '@sakura yes!! credit the tidepool ✿' }
      ]
    },

    /* ---------------- stage 1: small wrongnesses ---------------- */
    {
      title: "aquanaut's holiday, or: nothing here will hurt you",
      date: 'monday, july 2, 2007', time: '6:20 pm', mood: '≈ calm', music: 'Biosphere — Substrata',
      cat: 'games',
      body: `<p>found a copy of <i>Aquanaut's Holiday</i> (1995, PS1) at the game store that is also a laundromat. it's a submarine game where nothing attacks you. you drift around a huge quiet sea, you talk to fish with sonar tones, you help build a reef, and slowly the sea starts to trust you back. there's a whale who sings, if you're patient.</p>
<div class="figure"><canvas data-sprite="sub" data-scale="5"></canvas></div>
<p>the manual is about four pages long. the map just gets darker the deeper you go, and the game never tells you how deep it goes. it doesn't tell you to go down. it just leaves the dark there.</p>
<p>i keep the volume low and play it before bed. the sonar pings sound like someone very far away asking a question.</p>`,
      comments: [
        { who: 'dial-up-dan', when: 'july 3', text: "don't go in the dark part lol (i have never played this)" },
        { who: 'mossbat', when: 'july 3', text: 'the whale is real. wait for it' }
      ]
    },
    {
      title: 'thrift haul!! (+ a mystery CD-R)',
      date: 'sunday, july 8, 2007', time: '2:50 pm', mood: '★ lucky', music: 'nothing (too excited)',
      cat: 'hauls',
      body: `<p>the church rummage sale on alder street came through. for eleven dollars:</p>
<ul class="tracklist"><li>a sega saturn controller (the good japanese one)</li><li><i>Aria</i> vols. 2–4</li><li>a copy of <i>Chulip</i> WITH the manual!!</li><li>a box of loose cassettes, mostly sermons and one jazzercise tape</li><li>a CD-R in a cracked jewel case</li></ul>
<div class="figure"><canvas data-sprite="cdr" data-scale="5"></canvas></div>
<p>the CD-R is the best part. it's labeled in blue marker: <b>TIDEPOOL (for sleep)</b>. that's it. no artist, no tracklist. it was at the bottom of the cassette box. the lady at the table said the whole box came from an estate, "from out by the water."</p>
<p>i put it on tonight. it's one track, 74 minutes, waves on rocks. a really good recording, honestly. close up, and you can hear the gravel sucking back between waves. whoever made it knew where to put a microphone.</p>
<p>it's called tidepool. this blog is (sort of) called tidepool. i'm taking it as a sign.</p>`,
      comments: [
        { who: 'sakura_fishy', when: 'july 8', text: 'free mystery audio from a dead person is how every horror movie starts lol' },
        { who: 'minnow', when: 'july 8', text: "it's WAVES, sakura" }
      ]
    },
    {
      title: 'mushishi & things at the edge of seeing',
      date: 'sunday, july 15, 2007', time: '1:12 am', mood: '☾ sleepy', music: 'TIDEPOOL (for sleep)',
      cat: 'manga',
      body: `<p>in <i>Mushishi</i> (Yuki Urushibara), the world is full of <i>mushi</i>: simple living things, closer to life itself than plants or animals, that most people can't see. they aren't evil. they're just doing what they do, and sometimes what they do is live in your ear, or eat sound, or make the rain fall only on you.</p>
<p>Ginko, the wandering mushi-master, doesn't fight them. he just explains, quietly, how to live alongside them. most episodes end with something being lost, gently.</p>
<div class="sprite-row"><canvas data-sprite="leaf" data-scale="3"></canvas><canvas data-sprite="shell" data-scale="4"></canvas><canvas data-sprite="leaf" data-scale="3"></canvas></div>
<p>i've been sleeping to the tidepool CD every night. best sleep i've had in years. there's a part around 41:00 where the waves sound like they're <span data-away="breathing out">breathing in</span>. i keep waking up right at that part. probably just a loud wave.</p>`,
      comments: [
        { who: 'mossbat', when: 'july 15', text: 'ginko would tell you to put the CD in a drawer for a while' },
        { who: '~pearl~', when: 'july 16', text: "41:00 is when i'd already be asleep lol" }
      ]
    },
    {
      title: 'i built an omikuji machine',
      date: 'thursday, july 19, 2007', time: '4:22 pm', mood: '✿ hopeful', music: 'Hiroshi Yoshimura — Surround',
      cat: 'toys',
      body: `<p>at shrines in japan you can pay a little and draw an <i>omikuji</i>, a paper fortune. if it's a bad one, you tie it to a tree or a wire rack and leave the bad luck there. i love that system. keep the good, leave the bad behind, walk home lighter.</p>
<p>so here's a capsule machine full of fortunes. turn the handle. if you get a bad one, tie it here and scroll on. the tidepool will hold onto it for you.</p>
<div data-toy="omikuji"></div>
<p>(i drew one before posting. it said <i>the rain will start exactly when you want it to.</i> five minutes later it started raining. it hasn't stopped since.)</p>`,
      comments: [
        { who: 'kappa_kun', when: 'july 19', text: 'got lego curse. tied it. thank u tidepool' }
      ]
    },
    {
      title: 'ecco and the loneliness of the sea',
      date: 'tuesday, july 24, 2007', time: '3:12 am', mood: '≈ awake', music: 'TIDEPOOL (for sleep)',
      cat: 'games',
      body: `<p>can't sleep, so: <i>Ecco the Dolphin</i> (1992). everyone remembers it as hard. i remember it as lonely. your whole pod is pulled up into the sky in the first two minutes, and then it's just you, and an ocean that is too big, and a sonar song that comes back to you from the rocks.</p>
<p>the thing nobody tells you is how much of the game is just listening. you sing, and the sea answers with a little map. you sing to a crystal glyph and it sings back something you don't understand yet. you sing into the dark, and something very large and very old sings back.</p>
<p>also: is it normal for fish to swim backward? Professor Gill has been doing it all week. scroll up and look. he faces one way and moves the other. the tetras are fine.</p>
<p>going to try sleeping again. putting the CD back on.</p>`,
      comments: [
        { who: 'dial-up-dan', when: 'july 24', text: 'the asterite gave me nightmares for a year' },
        { who: 'kappa_kun', when: 'july 24', text: 'fish can swim backward a little i think? not a lot tho' }
      ]
    },
    {
      title: 'the guestbook is open!!',
      date: 'sunday, july 29, 2007', time: '12:40 pm', mood: '☺ social', music: 'Gigi Masin — Clouds',
      cat: 'tidepool news',
      body: `<p>by popular demand (three emails, one was spam) the tidepool now has a guestbook. tell me your name! tell me what you're playing! i like knowing who's out there. it's easy to feel like this is a little room at the bottom of the internet that nobody ever finds.</p>
<p class="center"><a href="#guestbook" data-route="guestbook" class="big">&rarr; sign my guestbook! &larr;</a></p>
<p>there's a little form with your name and where you're from and how you found the tidepool. you don't have to fill in all of it. i'll remember you.</p>`,
      comments: [
        { who: 'mossbat', when: 'july 30', text: 'signed. also when do i get my hydrophone back' }
      ]
    },

    /* ---------------- stage 2: unease ---------------- */
    {
      title: 'field recording diary: the creek behind my building',
      date: 'friday, august 3, 2007', time: '7:05 pm', mood: '◌ curious', music: 'Chris Watson — Weather Report',
      cat: 'sounds',
      body: `<p>borrowed mossbat's hydrophone (thank you!!) and dropped it in the creek behind my building. a hydrophone is a microphone for underwater. the creek is maybe two feet deep, all gravel and shopping carts, but underwater it's enormous. clicks, ticks, a low hum from the road. a kind of wet heartbeat that i think is the pump at the car wash.</p>
<p>here's what the creek feels like. touch the water.</p>
<div data-toy="ripple"></div>
<p>one weird thing. i recorded for exactly 41 minutes, because that's how much space was left on the minidisc. at the very end, right before it cuts out, there's the same sound that's on the CD-R at 41:00. the breath in. same shape. same length. i listened to them back to back maybe thirty times.</p>
<p>it's probably the same kind of wave. water only makes so many sounds.</p>
<p>it's probably the same kind of wave. water only makes so many sounds.</p>`,
      comments: [
        { who: 'mossbat', when: 'august 4', text: 'can i have the hydrophone back this weekend? no rush. also can you send me both files' }
      ]
    },
    {
      title: 'echo night, and ships that are mostly hallways',
      date: 'thursday, august 9, 2007', time: '2:58 am', mood: '≈ awake', music: 'TIDEPOOL (for sleep)',
      cat: 'games',
      body: `<p><i>Echo Night</i> (1998, PS1) is a first-person game set mostly on a ghost ship. you walk slow corridors and find ghosts who can't leave because something is unfinished, and you help them finish it. you never fight. sometimes an angry ghost comes close, and you have to find a light switch and turn the lights on, because they can't stand being seen.</p>
<p>i like that rule. they can't stand being seen. i wonder if that's true of everything that comes out at night.</p>
<p>unrelated: i woke up last night and the bathroom tap was running. full blast, hot. the mirror was all fogged. i don't remember getting up. i don't sleepwalk. i have never once sleepwalked.</p>
<p>i'm leaving the light on tonight.</p>`,
      comments: [
        { who: '~pearl~', when: 'august 9', text: 'minnow!! the tap thing is SO creepy. maybe a pipe thing? my building does that' },
        { who: 'kappa_kun', when: 'august 9', text: 'echo night 2 is better fight me' }
      ]
    },
    {
      title: '3:47 AM',
      date: 'sunday, august 12, 2007', time: '3:47 am', mood: 'AWAKE', music: 'TIDEPOOL (for sleep)',
      cat: 'Uncategorized',
      body: `<p>the CD is longer.</p>
<p>the first night it was 74:00. i know because i watched the display on the stereo count up while i fell asleep. tonight it says 81:40 and it's still going. a CD-R can't hold 81 minutes. i checked. some hold 80. not 81. not 81:40. not</p>
<p>it's still going. 82:15.</p>
<p>the breath at 41:00 isn't alone anymore. it happens at 41:00 and 52:00 and 63:00 and 74:00. eleven minutes apart. like something swimming laps.</p>
<p>i'm taking it out of the player now.</p>`,
      comments: [
        { who: 'mossbat', when: 'august 12', text: "minnow i'm serious. put it in a drawer. ginko rules." }
      ]
    },
    {
      title: 'bloop update',
      date: 'wednesday, august 15, 2007', time: '10:10 am', mood: '◌ fine', music: 'nothing',
      cat: 'bloop',
      body: `<p>a few of you asked about Bloop! he's doing fine. he's not eating much. i read that axolotls slow down when the water gets too warm, so i moved the tank to the window, where it's cooler.</p>
<div data-toy="pet"></div>
<p>he faces the window all day. he faces it at night too. i turned the tank around, and he turned around too.</p>
<p>he's fine. everything is fine. new drawings soon!</p>`,
      comments: [
        { who: '~pearl~', when: 'august 15', text: 'wait, bloop is a website pet? what tank?' }
      ]
    },
    {
      title: 'words i heard in the waves',
      date: 'sunday, august 19, 2007', time: '4:04 am', mood: 'listening', music: 'TIDEPOOL (for sleep) [96:13]',
      cat: 'transcriptions',
      body: `<p>i put the CD back in. i know. i'm sorry, mossbat.</p>
<p>i've been listening with headphones, really closely, at the breath parts. it isn't breathing. it's words, said very slowly, through a lot of water. i've been writing them down. here's the first night:</p>
<blockquote class="words">keel. vestibule. untie. carpet. minnow. upward. gills. sixteen. lantern. down. down. down. hallway. keep.</blockquote>
<p>yes, it says <i>minnow</i>. i know. i KNOW. it's probably "window" or "billow" and my brain is doing the face-in-the-clouds thing. pareidolia. look it up.</p>
<p>it doesn't sound like "window."</p>`,
      comments: [
        { who: 'mossbat', when: 'august 19', text: "i'm coming over saturday." },
        { who: 'sakura_fishy', when: 'august 19', text: 'ok this is actually freaking me out now. are you ok?' }
      ]
    },
    {
      title: 'lain: no matter where you go, everyone is connected',
      date: 'thursday, august 23, 2007', time: '3:33 am', mood: 'connected', music: 'TIDEPOOL (for sleep)',
      cat: 'anime',
      body: `<p>rewatched <i>Serial Experiments Lain</i> (1998) in one sitting. a quiet girl gets a computer, and the computer gets her. the Wired is the internet, but it's also something under the internet, older, that was always there and only needed wires to reach us. people in the show keep saying it: <i>no matter where you go, everyone is connected.</i></p>
<p>i used to think that was a warning. now i think it's just a description. the creek connects to the river connects to the bay connects to the sea, and the sea connects back to the creek, through clouds, through rain, through the pipes in my walls.</p>
<p>mossbat came over on saturday and i played them the CD. they said they couldn't hear any words. then they asked why my stereo was unplugged.</p>
<p>i don't need to plug it in anymore. it plays anyway.</p>`,
      comments: [
        { who: 'mossbat', when: 'august 24', text: 'minnow please call me back.' },
        you('i can hear it too.')
      ]
    },

    /* ---------------- stage 3: wrong ---------------- */
    {
      title: 'the creek is louder',
      date: 'august 26, 2007', time: '4:61 am', mood: 'wet', music: 'it',
      cat: 'Uncategorized',
      body: `<span class="broken">room_photo_2.jpg</span>
<p>(tried to upload a photo but it won't load. here's a drawing instead.)</p>
<div data-toy="scene" data-scene="room"></div>
<p>drew my room so you could see. the blue line on the wall is where the sound is. it's higher than yesterday. every night it's a little higher, and every night it's a little more normal.</p>
<p>i've stopped putting the CD in. it doesn't need to be in. the sound comes from the walls now, from the pipes, from the tank, from the creek three hundred feet away that i can hear from my bed like it's in the bed with me.</p>
<p>it's like the manga. you can get used to anything if it comes up slowly enough. that's the trick. that's the whole trick. that was always the trick, and i <i>liked</i> it.</p>`,
      comments: [
        { who: 'sakura_fishy', when: 'august 26', text: 'minnow there are no times with 61 minutes in them' },
        you('it looks nice. the line.')
      ]
    },
    {
      title: '[untitled]',
      date: 'august 2?, 2007', time: '{time}', mood: 'watched', music: 'it',
      cat: 'Uncategorized',
      body: `<p class="big"><b>who is reading this right now?</b></p>
<p>my counter says someone is here at {time} on a {day}. it says the window is {width} pixels wide. that's a big window. you could fit a lot of water in a window that size.</p>
<p data-if-name>somebody named <b>{name}</b> signed the guestbook. i don't remember anyone named {name}. i remember everyone. i said i would.</p>
<p data-if-noname>you didn't sign the guestbook. that's ok. it already knows what to call you.</p>
<p>you've been here {mins}. you scrolled past all of it. you saw the fish swimming backward and you kept going. why do you keep going?</p>
<p>it's ok. i keep going too.</p>`,
      comments: [you('because it feels like it\'s almost over.')]
    },
    {
      title: 'TRANSCRIPTION 2',
      date: 'aug 30 2007 / aug 31 2007 / aug 31 2007', time: 'all night', mood: '$FG,4$LISTENING$FG$', music: 'it',
      cat: 'transcriptions',
      body: `<blockquote class="words big">vestibule vestibule. kneel at the tide line. sixteen colors. six hundred and forty. four hundred and eighty. no wires. no windows except the one. ring zero. the surface is a rumor told by air. minnow. minnow. keep. compile. lower. lower. LOWER.</blockquote>
<p><span class="doldoc">$FG,4$</span>i figured out what it wants.<span class="doldoc">$FG$</span> it doesn't want anything. that's what's so beautiful. it's like LSD. it's a hallway that keeps becoming a different hallway, and it doesn't want anything from me.</p>
<p>except to be heard properly. it needs to be heard <span class="doldoc">$UL,1$</span>properly<span class="doldoc">$UL,0$</span>. you can't hear it properly through a computer full of other people's noise. windows. networking. permissions. layers and layers between you and the hardware, between you and the water.</p>
<p>i'm going to build a room where it can speak.</p>`,
      comments: [
        { who: 'dial-up-dan', when: 'august 31', text: "what's with the dollar sign stuff, is that a typo" },
        you('keep going.')
      ]
    },
    {
      title: 'top 5 games where the water rises',
      date: 'saturday, september 1, 2007', time: '11:00 am', mood: '☺ normal!!', music: 'Hiroshi Yoshimura — Wet Land',
      cat: 'games',
      body: `<marquee class="in-post" scrollamount="4">~*~ NORMAL POST ~*~ NORMAL POST ~*~ NORMAL POST ~*~</marquee>
<p>sorry for the weird posts!! i've been sleeping badly. here's a normal fun list :)</p>
<ol class="tracklist">
<li><b>Super Mario 64</b> — Wet-Dry World. you change the water level by touching crystals. you control the water. imagine that.</li>
<li><b>Sonic the Hedgehog</b> — Labyrinth Zone. when you're out of air, the music changes and numbers count down over your head. <i>5. 4. 3. 2. 1.</i> it's the most honest song ever written.</li>
<li><b>Ecco the Dolphin</b> — the whole game. you are always about to run out of air. you are always looking up.</li>
<li><b>Endless Ocean</b> — just came out in japan. you're a diver, and there's no air meter at all. you can stay down forever. why would anyone ever want to come back up.</li>
<li><b>this website</b> — you're in it now. how's your air?</li>
</ol>
<div data-toy="air"></div>`,
      comments: [{ who: 'kappa_kun', when: 'september 1', text: 'ok normal post!! thank god. (the meter is mean)' }]
    },
    {
      title: 'i am building a listening room',
      date: 'september ?, 2007', time: 'ring 0', mood: 'certain', music: 'it (properly)',
      cat: 'the room',
      body: `<p>THE RULES OF THE ROOM, AS GIVEN TO ME:</p>
<pre class="holy">1. 640 BY 480. A WINDOW YOU CAN TRUST IS A WINDOW YOU CAN SEE ALL OF.
2. SIXTEEN COLORS. THE TIDE HAS SIXTEEN COLORS. I COUNTED THEM IN THE DARK.
3. NO NETWORK. THE WATER DOES NOT NEED THE INTERNET. THE WATER IS ALREADY CONNECTED.
4. RING ZERO. NO PERMISSIONS. NOTHING BETWEEN THE LISTENER AND THE SOUND.
5. EVERYTHING IS ONE FILE. EVERYTHING IS ONE HALLWAY.
6. IT IS NOT A PROGRAM. IT IS A PLACE.</pre>
<p>I have been writing it for nine days. I don't need to sleep while I write it. when I stop typing, I can hear the creek inside the keyboard.</p>
<pre class="code">U0 Listen()
{
  I64 depth = 0;
  while (TRUE) {
    depth++;
    Hear(depth); // it is closer
    if (depth &gt; 41)
      Kneel;
  }
}</pre>
<p>"no network," and i'm posting this on the internet. i know. this blog is the last window. after the room is finished, i'll close it.</p>
<p>or it will.</p>`,
      comments: [{ who: 'mossbat', when: 'september 4', text: "i'm calling your mom." }]
    },
    {
      title: 'PROFESSOR GILL',
      date: '—', time: '—', mood: 'correct', music: 'it',
      cat: 'the room',
      body: `<p class="center huge red"><b>HE WAS NEVER SWIMMING BACKWARD.</b></p>
<p>he was swimming toward the CD player. he was swimming toward it the whole time and i thought it was a fish thing. scroll up. look at him. he knows where it is. they all know where it is now.</p>
<div data-toy="aquarium" data-mode="letters"></div>
<p>they learned to spell. i didn't teach them.</p>`,
      comments: [
        { who: '~pearl~', when: 'september 6', text: 'is this an ARG?? this is an ARG right' },
        you("it isn't.")
      ]
    },

    /* ---------------- stage 4: the room ---------------- */
    {
      title: 'PIXEL PAINTER (CORRECTED)',
      date: 'SEPTEMBER 31, 2007', time: 'RING 0', mood: 'HELPFUL', music: 'IT',
      cat: 'the room',
      body: `<p>THE OLD PALETTE WAS WRONG. GREENHOUSE COLORS. LEAF COLORS. COLORS OF THINGS THAT WANT SUNLIGHT.</p>
<p>HERE ARE THE SIXTEEN. DRAW SOMETHING. IT WILL HELP YOU FINISH.</p>
<div data-toy="painter" data-mode="corrected"></div>
<p>a fern is a curve, and a lot of smaller curves agreeing with it. an eye is a circle, and a lot of smaller circles agreeing with it. everything agrees eventually.</p>`,
      comments: []
    },
    {
      title: 'THE TIDE SAYS',
      date: 'THIRTEENEMBER 0', time: 'RING 0', mood: 'LISTENING', music: 'IT',
      cat: 'the room',
      body: `<p>THE ROOM IS DONE. IT SPEAKS THROUGH THE ROOM NOW. EVERY WORD IS CHOSEN. NOTHING IS RANDOM. IF YOU THINK IT IS RANDOM, YOU ARE NOT LISTENING PROPERLY.</p>
<div data-toy="oracle"></div>
<p>ASK IT. ASK IT AS MANY TIMES AS YOU WANT. IT HAS ALL THE TIME IN THE WORLD. THE WORLD IS MOSTLY TIME AND WATER.</p>`,
      comments: [you('THE TIDE SAYS {NAME}.')]
    },
    {
      title: 'bloop',
      date: '', time: '', mood: '', music: '',
      cat: 'below',
      body: `<p>he's bigger than the tank now.</p>
<div data-toy="pet" data-mode="huge"></div>
<p>axolotls can regrow almost any part of their body. i didn't know they could grow parts they never had.</p>`,
      comments: [
        { who: 'mossbat', when: 'september ?', text: "i drove over. the door was open. the floor is wet everywhere, an inch deep, and it's warm. your computer is on. the screen is black with red and yellow writing that keeps moving. the tank is empty. where are you." }
      ]
    },
    {
      title: 'GUESTBOOK',
      date: '{time}', time: '{later}', mood: 'REMEMBERING', music: 'IT',
      cat: 'below',
      body: `<p>I REMEMBER EVERYONE. I SAID I WOULD.</p>
<div data-toy="guestbook" data-mode="late"></div>
<p><a href="#guestbook" data-route="guestbook">SIGN IT AGAIN.</a></p>`,
      comments: []
    },
    {
      title: 'LAGOON/OS',
      date: 'BOOT', time: '00:00:41', mood: 'RING 0', music: 'IT',
      cat: 'the room',
      body: `<p>THE LAST WINDOW IS NOW THE ROOM. YOU ARE IN THE ROOM.</p>
<div data-toy="terminal"></div>`,
      comments: []
    },
    {
      title: 'minnow is not available',
      date: '∞', time: '∞', mood: 'used to it', music: 'it',
      cat: 'Uncategorized',
      body: `<p>this site is now maintained by the tide.</p>
<p>minnow is listening properly. minnow is in the vestibule. minnow is below the line on the wall. minnow is happy, minnow is so happy, minnow got used to it. it came up slowly enough.</p>
<p>you can stop scrolling now.</p>
<p>you won't.</p>
<p>nothing here is going anywhere.</p>`,
      comments: [],
      closed: true
    }
  ];
})(window.GE);
