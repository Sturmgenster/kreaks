/* =========================================================
   V68 · Kein Sichtweiten-Nebel mehr draußen. Nur ganz am Rand der
   Sichtweite blendet die Welt weich in den Himmel (damit nichts aufploppt).
   Höhlen und Innenräume behalten ihr eigenes Licht.
   ========================================================= */
{const sf0=setFog;setFog=function(near,far){if(P.x>60000)return sf0(near,far);const rd=settings.renderDist||140;return sf0(Math.max(near,rd*.86),Math.max(far,rd));};}
