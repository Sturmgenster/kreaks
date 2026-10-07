/* =========================================================
   V60 · Dialoge und Handel passend zur Geschichte
   Was die Leute sagen, hängt davon ab, wie weit die Geschichte ist:
   vor Kreak, mit dem Fremden, im Krieg gegen Shikaya, nach dem Sieg.
   ========================================================= */
function loreStage(){if(mqAt('end'))return'after';if(mqAt('ritual'))return'war';if(FLAGS.kreak||mqAt('find'))return'kreak';return'early';}
const LORE_LINES={
  early:{adult:['Seit ein paar Wochen leuchten im Nordwald nachts Augen. Ich gehe da nicht mehr hin.','Corvin sagt, so hat es damals auch angefangen. Mit den Augen im Wald.','Dofra sieht in jedem Fremden ein bisschen Kreak. Dich hat er bestimmt auch schon so angeschaut.',
      'Lutz hat am Waldrand einen komischen Kerl gesehen. Grüne Haare, sagt er. Und er wusste seinen Namen nicht.','Nachts kriechen Skelette und Ratten aus den Höhlen. Bleib im Dorf, wenn es dunkel wird.'],
    elder:['Meine Großmutter hat noch von den Dämonen erzählt. Ich dachte immer, das wären Märchen.','Kreak kommt wieder, wenn die Dunkelheit zurückkehrt. So sagt man seit hundert Jahren.','Ein roter Mond bringt Unheil. Ein blauer bringt Frieden. Merk dir das.'],
    kid:['Ich hab im Wald zwei leuchtende Augen gesehen! Ehrlich!','Wenn ich groß bin, werde ich wie Kreak!','Pip sagt, Kreak hatte ein Schwert so groß wie ein Haus.']},
  kreak:{adult:['Der Fremde mit den grünen Haaren … der sieht wirklich aus wie auf Corvins altem Bild.','Dofra lässt seine Esse seit Tagen nicht ausgehen. Er sagt, er wartet auf etwas Großes.',
      'Wenn das wirklich Kreak ist, warum weiß er dann nicht, wer er ist?','Akuma Senso … so hieß doch das Schwert aus der Legende, oder?','Seit die Dämonen wach sind, sind auch die Nächte gefährlicher. Pass auf dich auf.'],
    elder:['Ich hätte nicht gedacht, dass ich Kreak noch mit eigenen Augen sehe.','Ein Held ohne Gedächtnis. Vielleicht ist das ein Segen, vielleicht ein Fluch.'],
    kid:['Ist das echt Kreak? Darf ich ihn mal anfassen?','Kreak hat mir zugewinkt! Glaub ich.']},
  war:{adult:['Man sagt, Kreak erinnert sich wieder. Und dass er in die Unterwelt will.','Der Mond wird rot, sagt Corvin. Wir verriegeln nachts die Türen.','Murgla, die Froschhexe, kennt das Ritual. Mir ist bei dem Gedanken nicht wohl.',
      'Wenn Kreak in die Unterwelt geht, wer beschützt dann Coda?','Shikaya … man sagt den Namen nur leise.'],
    elder:['Diesen Namen hat seit hundert Jahren niemand mehr laut gesagt. Shikaya.','Bete für die beiden, Fremder. Sie werden es brauchen.'],
    kid:['Mama sagt, ich darf nicht mehr raus, wenn der Mond rot ist.','Ich hab keine Angst vor Dämonen! … Ein bisschen.']},
  after:{adult:['Du warst dabei, als Shikaya fiel! Das Bier geht heute auf mich. Na ja, auf Hagen.','Seit der Blutmond verblasst ist, schlafe ich wieder ruhig. Fast.',
      'Die Dämonen sind fort, aber nachts kommen immer noch Skelette aus den Höhlen. Manche Dinge ändern sich nie.','In Sturmburg singen sie schon Lieder über die Schlacht um Coda.',
      'Kreak zieht mit dir weiter? Pass gut auf ihn auf. Er hat genug verloren.','Jetzt, wo es ruhig ist, will ich endlich mal die Kaiserstadt im Osten sehen.'],
    elder:['So ein Ende hätte die Legende schon damals verdient.','Shikaya war einmal ein Mädchen, sagt Corvin. Was für ein trauriges Ende.'],
    kid:['Ich spiele jetzt immer Kreak und Fiete ist Shikaya! Na gut, manchmal umgekehrt.','Bist du der Held? Echt jetzt? Kann ich ein Autogramm?']}};
const WORLD_LINES=['Im Osten, hinter dem Redwood, liegt die Savanne. Dort gibt es Löwen, so groß wie Ponys.','Kaufleute aus der Kaiserstadt zahlen ein Vermögen für Mahagoni aus dem Dschungel.',
  'Die Affenmenschen im Dschungel bezahlen mit Bananen. Kein Witz!','Jedes Holz hat seinen Preis. Mammutholz hält ewig, Totholz brennt gut.','Bei Blue Lunar trauen sich nicht mal die Skelette heraus. Dann ist die Nacht friedlich.',
  'Im Westen am großen See leben die Froschleute. Nachts singen sie, das hört man bis zum Fluss.','Tief unter der Erde liegt Tiefgrund, ein Dorf der Maulwürfe. Die verkaufen Erze, die du nirgends sonst findest.',
  'In der Wüste hütet Sefu, der letzte Sonnenpriester, das Grab des Pharaos.','Auf dem Löwenfelsen in der Savanne liegt ein Löwe und schaut über sein Land. Komm ihm nicht zu nahe.',
  'Die Gnus ziehen in riesigen Herden durch die Savanne. Wo sie sind, sind auch die Löwen nicht weit.'];
const LORE_ROLE={after:{Schmied:['Das Akuma Senso … mein bestes Werk. So etwas schmiede ich nie wieder.','Jetzt schmiede ich wieder Hufeisen. Ist auch schön. Ruhiger.'],
    Pfarrer:['Ich habe die Legende neu aufgeschrieben. Mit einem besseren Ende.','Die Glocke hat nach der Schlacht zum ersten Mal seit Jahren geläutet.'],
    Wirt:['Seit der Schlacht ist das Wirtshaus jeden Abend voll!','Auf Kreak! Und auf dich!'],Wirtin:['Hagen erzählt die Schlacht jeden Abend ein bisschen größer.'],
    Landsknecht:['Ich habe viele Schlachten gesehen. Aber die um Coda … die war etwas Besonderes.'],'Müller':['Die Mühle dreht sich wieder nur bei Wind. Gut so.'],
    Bauer:['Nach der Schlacht musste ich die halbe Weide neu einzäunen. Aber wir leben.'],'Totengräber':['Diesmal musste ich kaum graben. Dank dir.']},
  war:{Schmied:['Das Schwert ist fertig. Jetzt liegt es an euch beiden.'],Pfarrer:['Ich bete jede Nacht für euch. Und für Coda.'],Wirt:['Seit dem roten Mond trinken die Leute mehr. Und reden weniger.']}};
{const vl1=villagerLine;villagerLine=function(v){if(v.goHome)return vl1(v);const st=loreStage(),R=LORE_ROLE[st]&&v.role&&LORE_ROLE[st][v.role];
  if(v.role==='Bauer'&&FLAGS.farmWarn&&Math.random()<.4)return'Wer mäht mir eigentlich ständig den Weizen ab?! Wenn ich den erwische …';
  if(R&&Math.random()<.6)return R[(Math.random()*R.length)|0];if(v.role&&LINES[v.role]&&Math.random()<.6)return vl1(v);
  const k=v.d.kid?'kid':v.d.elder?'elder':'adult',S=LORE_LINES[st][k],x=Math.random();
  if(x<.5&&S)return S[(Math.random()*S.length)|0];if(x<.75&&!v.d.kid)return WORLD_LINES[(Math.random()*WORLD_LINES.length)|0];return vl1(v);};}
// ---------- Hagens Neuigkeiten ----------
function hagenNews(){const st=loreStage(),N=[];
  if(st==='early')N.push('Dofra erzählt jedem, Kreak kehre bald zurück. Nach dem dritten Krug glaubt man ihm fast.','Lutz hat am Rand vom Tiefen Wald Spuren gesehen, so groß wie ein Wagenrad.');
  if(st==='kreak')N.push('Ganz Coda redet über deinen grünhaarigen Freund. Die Hälfte hält ihn für Kreak, die andere für verrückt.','Dofra hat sich drei Säcke Kohle bringen lassen. Was der wohl vorhat?');
  if(st==='war')N.push('Murgla hat den Blutmond gerufen, sagen die Fischer. Ich trinke heute selbst einen.','Seit die Dämonen wach sind, kommen nachts mehr Skelette aus den Höhlen als früher.');
  if(st==='after')N.push('Sturmburg schickt Boten mit Dankesbriefen. Einer hat drei Tage lang meinen Met getrunken.','Seit Shikaya fort ist, kommen sogar Händler aus der Kaiserstadt bis nach Coda.');
  N.push('Merten sagt, seine Mühle dreht sich nachts manchmal von allein. Gegen den Wind.',
    'Nachts kriechen Skelette und Riesenratten aus den Höhlen. Bei Blue Lunar nicht, da bleibt alles ruhig. Aber beim Blutmond … da kommen Schlimmere.',
    'Ein Händler aus dem Osten erzählt von einer Riesenschlange im Dschungel. Natta nennen sie die Affenmenschen. Dick wie ein Fass, lang wie eine Brücke.',
    'Wer im Osten Mahagoni schlägt, kann es in der Kaiserstadt teuer verkaufen. Meister Wen auf dem Markt zahlt am besten.',
    'Auf dem Löwenfelsen in der Savanne hat ein Reisender ein ganzes Rudel gesehen. Mittags dösen sie in einer Höhle unter dem Felsen.',
    'Ruprecht kauft Heu für seine Pferde. Fasern, Weizen, alles, was man ihnen vorwerfen kann.');
  return N[(Math.random()*N.length)|0];}
// ---------- Bestehende Dialoge an den Stand der Geschichte anpassen ----------
function lorePatchDialogs(){
  const C=DIALOGS.Corvin;if(C){const d0=C.nodes.demons;C.nodes.demons=()=>{const n=d0();const st=loreStage();
      if(st==='after')n.text='Die Augen im Nordwald sind erloschen. Shikaya ist fort, und mit ihr ihre Dämonen. Nur die Toten in den Höhlen schlafen unruhig wie eh und je.';
      else if(st==='war')n.text='Die Dämonen sind wach. Shikaya ruft sie. Ich bete, dass Kreak stark genug ist, diesmal zu Ende zu bringen, was er damals begonnen hat.';
      else if(st==='kreak')n.text='Die Augen im Nordwald werden mehr, nicht weniger. Aber Kreak ist zurück. Das muss etwas bedeuten.';return n;};
    const l3=C.nodes.legend3;if(l3)C.nodes.legend3=()=>{const n=l3();if(loreStage()==='after')n.text='So endete die alte Legende. Die neue kennst du besser als ich: Kreak kehrte zurück, fand sein Schwert und stellte sich Shikaya. Und diesmal brachte er es zu Ende.';return n;};}
  const D=DIALOGS.Dofra;if(D){const s0=D.start;D.start=()=>{const s=s0();return s==='kreak'&&(mqAt('search')||FLAGS.kreakNamed)?'hello':s;};
    const u0=D.nodes.under;D.nodes.under=()=>{const n=u0();const st=loreStage();if(st==='after')n.text='Die Gänge unter dem Nordwald sind still geworden. Nur die Skelette klappern noch. Die hat Shikaya nicht gemacht, die waren schon immer da.';
      else if(st==='war')n.text='Die Unterwelt hat sich geöffnet, und meine Esse brennt seitdem rot. Was ihr da unten findet, kann kein Hammer reparieren. Nur euer Mut.';return n;};
    const h0=D.nodes.hello;D.nodes.hello=()=>{const n=h0();if(loreStage()==='after')n.text='Na, Held? Mein Feuer brennt, mein Hammer ist bereit. Und mein Herz ist leichter als seit Jahren.';return n;};}
  const H=DIALOGS.Hagen;if(H){H.nodes.news=()=>({text:hagenNews(),opts:[{label:'Noch etwas?',go:'news'},{label:'Zurück',go:'hello'}]});}}
{const s2=setupStoryDialogs;setupStoryDialogs=function(){s2();try{lorePatchDialogs();}catch(e){console.error('lore',e);}};}
// ---------- Handel ----------
function woodSell(k){return WOOD_IDS.map(w=>[w,Math.max(1,Math.round(WOODS[w][6]*k))]);}
function lorePatchShops(){const S=SHOPS;
  const noWood=L=>L.filter(([id])=>id!=='wood');
  if(S.Dofra){S.Dofra.sell=noWood(S.Dofra.sell).concat(woodSell(1),[['clay',2]]);}
  if(S.Hagen){S.Hagen.sell.push(['wheat',2],['berries',2],['coconut',3]);S.Hagen.greet='Frisches Brot und Met aus eigener Herstellung. Fliegenpilze, Weizen und Beeren kaufe ich auch. Frag lieber nicht, wofür die Pilze sind.';}
  if(S.Ruprecht){S.Ruprecht.sell=(S.Ruprecht.sell||[]).concat([['wheat',2],['fiber',1]]);S.Ruprecht.greet='Das Mindestgebot gilt. Und Heu kaufe ich immer: Weizen, Fasern, Hauptsache, die Gäule werden satt.';}
  if(S.Corvin){S.Corvin.sell=(S.Corvin.sell||[]).concat([['flower',2]]);S.Corvin.greet='Mit Weihwasser und Kräutern aus dem Klostergarten gebraut. Wildblumen für den Altar nehme ich dir gern ab.';}
  if(S.Quorg){S.Quorg.buy.push(['rope',5]);S.Quorg.sell.push(['clay',3],['fiber',1],['bamboo',3]);S.Quorg.greet='Quaak! Angeln aus bestem Schilf. Jeden Fisch kaufe ich dir ab. Und Lehm für unsere Hütten, Fasern für die Netze, Bambus für die Angeln.';}
  if(S.Murgla){S.Murgla.sell.push(['flower',4],['berries',2]);S.Murgla.greet='Quaaah … Tränke willst du? Gut gebraut, teuer bezahlt. Pilze, Blumen und Mumienbinden kaufe ich auch. So ist das bei Murgla.';}
  if(S.Sefu){S.Sefu.buy.push(['cactusf',3]);S.Sefu.greet='Wasser ist hier draußen mehr wert als Gold. Brot und Kaktusfleisch habe ich auch. Die Binden der Toten nehme ich dir ab, damit sie Ruhe finden.';}
  if(S.Bana){S.Bana.base=[['roastmeat',3],['coconut',2],['hpot',6],['hpot2',12],['spear',12],['rod',8],['rope',3],['bamboo',2]];
    S.Bana.sell=S.Bana.sell.concat([['w_maha',3],['berries',1],['clay',1]]);S.Bana.greet='Uk! Hier zahlt man mit Bananen. Glänzende Steine kann man nicht essen. Ich kaufe Felle, Fleisch, Federn und alles, was die Savanne hergibt. Mumbos Heiltränke gibt es auch.';}
  for(const n of['Schorf']){if(S[n])S[n].sell=S[n].sell.concat(woodSell(1.6));}if(S['Wühla'])S['Wühla'].sell.push(['berries',3],['coconut',4]);}
{const sw0=setupStoryDialogs;setupStoryDialogs=function(){sw0();try{lorePatchShops();}catch(e){console.error('shops',e);}};}
// Tiefgrund baut seine Läden erst in der Höhle: dort nachbessern
{const am0=addMoleNPC;addMoleNPC=function(name,x,z,o){const m=am0(name,x,z,o);try{if(name==='Schorf'&&SHOPS.Schorf&&!SHOPS.Schorf._w){SHOPS.Schorf._w=1;SHOPS.Schorf.sell=SHOPS.Schorf.sell.concat(woodSell(1.6));SHOPS.Schorf.greet='Werkzeug, das nicht bricht. Fast nie. Holz kaufe ich teuer, hier unten wächst ja keins.';}
    if(name==='Wühla'&&SHOPS['Wühla']&&!SHOPS['Wühla']._w){SHOPS['Wühla']._w=1;SHOPS['Wühla'].sell.push(['berries',3],['coconut',4]);}}catch(e){}return m;};}
// ---------- Reisende Händler: eigene Begrüßung, Waren passend zur Route ----------
for(let i=0;i<MERCH_POOL.length;i++)if(MERCH_POOL[i][0]==='wood')MERCH_POOL[i]=['w_oak',5];
const MERCH_LORE={Bertram:{greet:['Brot, Werkzeug und Holz aus dem Wald! Alles, was ein Wanderer braucht.','Na, wieder unterwegs? Ich hab frische Ware aus Coda.'],extra:[['w_oak',5],['w_birch',4],['berries',3],['rope',6]],
    where:'Immer zwischen dem Wald und Coda hin und her. Die Brücke kenne ich besser als mein eigenes Haus. Nachts schlage ich mein Lager am Weg auf.'},
  Wanda:{greet:['Wolle, Seile und Fisch von der Küste! Und ein paar Kleinigkeiten von den Froschleuten.','Komm näher, komm näher! Heute habe ich etwas Besonderes für dich.'],extra:[['rope',6],['wool',8],['trout',6],['clay',3]],
    where:'Nach Westen bis zur Küste. Die Fischer dort zahlen gut für Wolle, und die Froschleute für Seile.'},
  Ole:{greet:['Mammutholz, Chitin und Werkzeug, das hält. Aus dem Osten, wo die Bäume den Himmel kratzen.','Ich ziehe von Ort zu Ort. Was ich heute habe, ist morgen vielleicht schon weg.'],extra:[['w_red',8],['chitin',24],['spick',26]],
    where:'Nach Osten zum Redwood. Riesige Bäume, riesige Ameisen. Ich bleibe auf dem Weg. Weiter östlich beginnt die Savanne, aber da bringen mich keine zehn Pferde hin.'},
  Gisbert:{greet:['Warme Wolle, gute Klingen und Neuigkeiten aus Sturmburg. Die Wache kauft mir alles ab.','Waren aus aller Herren Länder! Na ja, aus drei Ländern. Aber gute!'],extra:[['wool',9],['w_dark',6],['helm',62]],
    where:'Hinauf nach Sturmburg, die Serpentinen hoch. Oben ist es kalt, und die Wachen zahlen gut für warme Wolle.'}};
{const ms0=merchStock;merchStock=function(m){const day=FLAGS.day||0,fresh=m.stockDay!==day;ms0(m);const L=MERCH_LORE[m.name],S=SHOPS[m.name];if(!L||!S)return;
  if(fresh){const r=mulberry32((FLAGS.seed||1)+day*311+m.i*17),ex=L.extra.filter(()=>r()<.6);for(const e of ex)if(!S.buy.some(b=>b[0]===e[0]))S.buy.push(e);S.sell=S.sell.concat(woodSell(.8)).concat([['fiber',1],['berries',1]]);}
  S.greet=L.greet[day%L.greet.length];};}
function lorePatchMerchants(){for(const m of MERCHANTS){const L=MERCH_LORE[m.name],D=DIALOGS[m.name];if(!L||!D)continue;
  D.nodes.hello=()=>({text:`${L.greet[(FLAGS.day||0)%L.greet.length]} Ich bin ${m.name}.`,opts:[{label:'Zeig mir deine Waren.',act:()=>{merchStock(m);openShop(m.name);return null;}},{label:'Wohin reist du?',go:'where'},{label:'Gute Reise.',go:null}]});
  D.nodes.where=()=>({text:L.where,opts:[{label:'Zurück',go:'hello'}]});}}
{const fg0=fixGisbertDialog;fixGisbertDialog=function(){fg0();try{lorePatchMerchants();}catch(e){console.error('merch',e);}};}
// ---------- Affenmenschen, Grok, Kaiserstadt, Sturmburg ----------
APE_LINES.push('Natta! Die große Schlange! Sie schläft im Sumpf und frisst, wer zu laut ist.','Wenn die Vögel verstummen, ist Natta in der Nähe. Dann klettern wir auf die Bäume.','Natta hat letzten Mond eine ganze Kuh vom Bongo-Fluss verschluckt. Sagt Bobo.');
GROK_LINES.push('Natta groß. Natta frisst Grok-Freund. Grok geht nicht zu Natta.','Nachts Grok schläft in Höhle. Draußen Knochen-Leute. Böse.');
K_LINES.push('Händler, die Mahagoni aus dem Dschungel bringen, werden in der Kaiserstadt reich. Frag Meister Wen auf dem Markt.','Man sagt, im Westen hat ein Held die Dämonenkönigin geschlagen. Ob das stimmt?',
  'Nachts schließen wir die Läden. Nur die Laternen und die Wache bleiben wach.','In der Savanne liegt der Löwenfelsen. Der Kaiser soll dort als Junge einen Löwen gezähmt haben. Sagt der Kaiser.');
GUARD_LINES.push('Nachts kommen Skelette aus den Höhlen am Berg. Wir halten sie von der Straße fern.','Sturmburg steht seit dreihundert Jahren. Kein Dämon hat diese Mauern je überwunden.');
{const ua1=DIALOGS['Uka-Uka'];if(ua1){const h0=ua1.nodes.hello;ua1.nodes.hello=()=>{const n=h0();n.opts.splice(n.opts.length-1,0,{label:'Wer ist Natta?',go:'natta'});return n;};
  ua1.nodes.natta=()=>({text:FLAGS.nattaDead?'Natta ist tot. Der Dschungel atmet auf. Du bist jetzt ein Freund des Stammes. Für immer. Oder bis die Bananen ausgehen.':'Natta ist die Mutter aller Schlangen. Sie ist älter als der Tempel, sagt Mumbo. Meistens schläft sie im Schlamm, tief im Dschungel. Manchmal kriecht sie über den Pfad, und dann ist es still. Ganz still. Such sie nicht. Wenn du sie doch suchst: Bring viele Heiltränke mit.',
    opts:[{label:'Danke für die Warnung.',go:'hello'},bye]});}}
{const mb=DIALOGS.Mumbo;if(mb){const t0=mb.nodes.temple;mb.nodes.temple=()=>{const n=t0();if(!FLAGS.nattaDead)n.text+=' Und hüte dich vor Natta. Im Rauch sehe ich ihre Augen. Gelb wie der Mond beim Laternenfest.';return n;};}}
// ---------- Meister Wen: Holzhändler auf dem Markt der Kaiserstadt ----------
SHOPS['Meister Wen']={title:'Meister Wens Edelhölzer',greet:'Edelholz! Mahagoni aus dem Dschungel, Kirsche und Ahorn aus unseren Gärten. Ich kaufe, was gut ist, und zahle, was es wert ist.',
  buy:[['w_cherry',14],['w_maple',12],['w_maha',16],['rope',5],['rod',24],['bamboo',4]],sell:woodSell(1.4).concat([['bamboo',3],['rope',3]])};
DIALOGS['Meister Wen']={start:()=>'hello',nodes:{hello:()=>({text:'Ah, ein Reisender aus dem Westen! Ich bin Wen, Holzmeister des Kaisers. Die Pagode, der Palast, sogar die Laternenstangen: alles mein Holz.',
    opts:[{label:'Lass uns handeln.',act:()=>{openShop('Meister Wen');return null;}},{label:'Welches Holz ist am wertvollsten?',go:'wood'},{label:'Auf Wiedersehen.',go:null}]}),
  wood:()=>({text:'Aschholz aus der Unterwelt, wenn du so etwas wagst. Danach Mahagoni von den Urwaldriesen im Dschungel. Kirsch- und Ahornholz wachsen hier in den Gärten. Mammutholz ist zäh und gut für Brücken. Totholz? Nur für den Ofen.',opts:[{label:'Zurück',go:'hello'}]})}};
let kWen=null;
function wenPortrait(){const pc=document.createElement('canvas');pc.width=pc.height=22;const c=pc.getContext('2d'),S=SPR.ct3_0;c.imageSmoothingEnabled=false;if(S)c.drawImage(S.c,Math.max(0,(S.w-22)/2),0,22,22,0,0,22,22);return pc;}
{const uk0=updateKCitizens;updateKCitizens=function(){uk0();if(!kCitizens){kWen=null;return;}if(kWen||!MKT_STALLS.length)return;const[x,z]=MKT_STALLS[0];let best=null,bd=6;
  for(const e of kCitizens){if(e.role!=='Händler')continue;const d=Math.hypot(e.x-x,e.z-z);if(d<bd){bd=d;best=e;}}
  if(!best){best=spawnEnt('citizen',x,z,{ci:3,name:'Meister Wen',role:'Holzhändler',always:true,wander:false,noHostile:true});kCitizens.push(best);}
  kWen=best;kWen.name='Meister Wen';kWen.role='Holzhändler des Kaisers';kWen.promptName='Mit Meister Wen';kWen.portrait=wenPortrait();kWen.lines=['Edelholz! Mahagoni, Kirsche, Ahorn!','Gutes Holz hält hundert Jahre. Schlechtes brennt eine Nacht.','Kauf Holz bei Wen, und dein Haus steht noch, wenn deine Enkel alt sind.'];};}
{const sl2=storyLooked;storyLooked=function(){const v=sl2();if(v)return v;if(kWen&&!kWen.hidden&&!kWen.dead&&Math.abs(P.x-kWen.x)<6&&Math.abs(P.z-kWen.z)<6)return lookNPC([kWen]);return null;};}
