/* Exporte les extraits des fiches en fichiers .c compilables.
 * Usage : node scripts/export-references.mjs
 * La CI exécute ensuite le compilateur et la Norminette officielle.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const source = fs.readFileSync(path.join(root,"data/references.js"),"utf8");
const refsMatch = source.match(/const refs = ([\s\S]*?);\n  const examples =/);
if (!refsMatch) throw new Error("Impossible de trouver le catalogue de références");
const refs = JSON.parse(refsMatch[1]);
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,"data/catalog.js"),"utf8"),context);
const catalog = context.window.MANUAL.filter(entry => entry.kind === "libft");
const dir = path.join(root,"generated");
fs.mkdirSync(dir,{recursive:true});

function header(filename) {
  const row = (left,right) => ("/*   "+left).padEnd(80-right.length," ")+right;
  return [
    "/* ************************************************************************** */",
    "/*                                                                            */",
    "/*                                                        :::      ::::::::   */",
    row(filename,":+:      :+:    :+:   */"),
    "/*                                                    +:+ +:+         +:+     */",
    row("By: student <student@42.fr>"," +#+  +:+       +#+        */"),
    "/*                                                +#+#+#+#+#+   +#+           */",
    row("Created: 2026/11/18 00:00:00 by student","#+#    #+#             */"),
    row("Updated: 2026/11/18 00:00:00 by student","###   ########.fr       */"),
    "/*                                                                            */",
    "/* ************************************************************************** */",
  ].join("\n");
}
const h = [
  "#ifndef LIBFT_H",
  "# define LIBFT_H",
  "# include <stddef.h>",
  "# include <stdlib.h>",
  "# include <unistd.h>",
  "typedef struct s_list",
  "{",
  "\tvoid\t\t\t*content;",
  "\tstruct s_list\t*next;",
  "} t_list;",
  ...catalog.map(item => item.prototype),
  "#endif"
].join("\n");
fs.writeFileSync(path.join(dir,"libft.h"),h+"\n");
const missing=[];
for(const entry of catalog) {
  const ref=refs[entry.name];
  if(!ref) {missing.push(entry.name);continue;}
  const lines=ref.split("\n");
  for(const [i,line] of lines.entries()){
    if(line.replace(/\t/g,"    ").length>80) throw new Error(entry.name+":"+(i+1)+" : ligne >80 colonnes");
    if(/[ \t]$/.test(line)) throw new Error(entry.name+":"+(i+1)+" : espaces fin de ligne");
  }
  fs.writeFileSync(path.join(dir,entry.name+".c"),header(entry.name+".c")+"\n\n#include \"libft.h\"\n\n"+ref+"\n");
}
if(missing.length) throw new Error("Références manquantes : "+missing.join(", "));
console.log(catalog.length+" références exportées dans generated/.");
