/* =========================================================
   V61/62 · Start der Hauptquest: Dofra sagt, man erinnere ihn an Kreak.
   Danach erzählt Hagen im Wirtshaus vom Fremden am Waldrand, und die Quest beginnt.
   ========================================================= */
function mqStartAtHagen(){if(FLAGS.mq!=null)return;mqSet(0,true);setTimeout(()=>toast('Neue Hauptquest! Drück J für die Chronik.'),400);}
{const s3=setupStoryDialogs;setupStoryDialogs=function(){s3();try{
  const D=DIALOGS.Dofra,hint=()=>FLAGS.mq==null?' Ach, und geh mal rüber zu Hagen ins Wirtshaus. Der hört alles, was in Coda und drumherum passiert.':'';
  D.nodes.kreak=()=>({text:'(Dofra legt den Hammer beiseite und mustert dich mit seinem einen Auge.) Hm. Weißt du was, Fremder? Du erinnerst mich an jemanden. An Kreak, den Helden aus den alten Geschichten. Irgendwas an der Art, wie du dastehst. Na ja, ich sehe wohl in jedem Fremden ein bisschen Kreak.',
    opts:[{label:'Wer ist dieser Kreak?',act:()=>{FLAGS.dofraAsked=1;return null;},go:'who'},{label:'Das nehme ich als Kompliment.',act:()=>{FLAGS.dofraAsked=1;return null;},go:'maybe'}]});
  D.nodes.maybe=()=>({text:'Solltest du auch. Kreak hat dieses Land einst vor den Dämonen gerettet. Corvin in der Kirche kennt die ganze Legende.'+hint(),opts:[{label:'Weiter',go:'hello'}]});
  D.nodes.who=()=>({text:'Du kennst die Legende nicht? Kreak hat das Land einst vor den Dämonen der Unterwelt beschützt. Corvin erzählt sie dir besser als ich. Ich bin Schmied, kein Geschichtenerzähler.'+hint(),opts:[{label:'Weiter',go:'hello'}]});
  D.nodes.yes=D.nodes.maybe;
  const dh=D.nodes.hello;D.nodes.hello=()=>{const n=dh();n.opts=n.opts.filter(o=>!/Ich bin Kreak/.test(o.label));if(/Was brauchst du, Kreak\?/.test(n.text))n.text=n.text.replace('Was brauchst du, Kreak?','Was brauchst du?');return n;};
  const H=DIALOGS.Hagen,h0=H.nodes.hello;H.nodes.hello=()=>{const n=h0();if(FLAGS.mq==null&&FLAGS.dofraAsked){n.text='Na, hat Dofra dir auch erzählt, dass du ihn an Kreak erinnerst? Ha! Das sagt er jedem. Aber setz dich. Ausgerechnet heute gibt es eine seltsame Geschichte, und die passt zu Dofras Spinnereien.';
      n.opts.unshift({label:'Eine seltsame Geschichte? Erzähl.',act:()=>{mqStartAtHagen();return null;},go:'mq_h1'});}return n;};
  }catch(e){console.error('Queststart',e);}};}
{const rj0=renderJournal;renderJournal=function(){rj0();try{if(FLAGS.mq==null){const q=$('jrQuest');if(q)q.innerHTML='<h3>Noch keine Hauptquest</h3><ul><li class="cur"><i>➜</i>'+(FLAGS.dofraAsked?'Geh zu Hagen ins Wirtshaus in Coda':'Sprich mit Dofra, dem Schmied von Coda')+'</li></ul>';}}catch(e){}};}
