/* 0.0.107 · Skelette und Zombies etwas größer als der Spieler
   (die Bilder haben oben Rand, deshalb wirkten sie mit 1,9 m zu klein) */
for(const k of['nskel','usks','uska','uskh','uskb'])if(DT[k])DT[k].h=2.45;
for(const k of['usksa','uskaa','uskha','uskba'])if(DT[k])DT[k].h=2.5;
if(DT.zombie)DT.zombie.h=2.85;
if(DT.g_skelwar)DT.g_skelwar.h=3.0;
for(const k of['lichf','lichi','lichs','lichb'])if(DT[k])DT[k].h=2.55;
if(DT.elderlich)DT.elderlich.h=3.0;
if(typeof MOB!=='undefined'&&MOB.skeleton)MOB.skeleton.h=2.45;
if(typeof RAID!=='undefined'&&RAID.skeleton)RAID.skeleton.h=2.45;
