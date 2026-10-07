/* =========================================================
   V67 · Bäume, Sträucher und Pflanzen etwas größer (überall)
   ========================================================= */
const VEG_TREE=/^(wl_)?(pine|oak|birch|dpine|dead|redwood|jtree|jpalm|palm|acacia|baobab|sakura|maple|kpine|snowpine|snowdead|swamptree|bamboo)\d*$/,
      VEG_BUSH=/^(wl_)?(bush|jbush|jleaf|snowbush|dshrub|cactus|bcactus|fern|liana|reed|tall|grass|sgrass|flower|herb|mushroom|cmush|frost)\d*$/;
function vegScale(list){for(const b of list){if(!b||!b.spr||b._vs||b.y<-500)continue;const k=VEG_TREE.test(b.spr)?1.15:VEG_BUSH.test(b.spr)?1.12:0;if(!k)continue;b._vs=1;b.w*=k;b.h*=k;}}
{const mb1=makeBillboards;makeBillboards=function(list,mat){try{vegScale(list);}catch(e){}return mb1(list,mat);};}
