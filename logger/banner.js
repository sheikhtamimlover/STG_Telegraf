const c = require('./color');

function getBanner() {
  const packageJson = require('../package.json');
  const version = packageJson.version || '1.0.0';
  
  return `
${c.blue('╔═══════════════════════════════════════════════════════════════╗')}
${c.blue('║')}                                                               ${c.blue('║')}
${c.blue('║')}     ${c.bright(c.cyan('███████╗████████╗ ██████╗     ████████╗███████╗██╗      '))}  ${c.blue('║')}
${c.blue('║')}     ${c.bright(c.cyan('██╔════╝╚══██╔══╝██╔════╝     ╚══██╔══╝██╔════╝██║      '))}  ${c.blue('║')}
${c.blue('║')}     ${c.bright(c.cyan('███████╗   ██║   ██║  ███╗       ██║   █████╗  ██║      '))}  ${c.blue('║')}
${c.blue('║')}     ${c.bright(c.cyan('╚════██║   ██║   ██║   ██║       ██║   ██╔══╝  ██║      '))}  ${c.blue('║')}
${c.blue('║')}     ${c.bright(c.cyan('███████║   ██║   ╚██████╔╝       ██║   ███████╗███████╗ '))}  ${c.blue('║')}
${c.blue('║')}     ${c.bright(c.cyan('╚══════╝   ╚═╝    ╚═════╝        ╚═╝   ╚══════╝╚══════╝ '))}  ${c.blue('║')}
${c.blue('║')}                                                               ${c.blue('║')}
${c.blue('║')}        ${c.white(`STG_Telegraf - Advanced Bot Framework v${version}`)}           ${c.blue('║')}
${c.blue('║')}              ${c.dim('Developed by Sheikh Tamim')}                        ${c.blue('║')}
${c.blue('║')}                                                               ${c.blue('║')}
${c.blue('╚═══════════════════════════════════════════════════════════════╝')}
`;
}

function showBanner() {
  console.clear();
  console.log(getBanner());
}

function showCopyright() {
  const c = require('./color');
  console.log('\n' + c.yellow('═'.repeat(70)));
  console.log(c.bright(c.cyan('  © 2025 STG_Telegraf - All Rights Reserved')));
  console.log(c.white('  Created by: Sheikh Tamim'));
  console.log(c.white('  GitHub: https://github.com/sheikhtamimlover/STG_Telegraf'));
  console.log(c.white('  Telegram: https://t.me/STGBOTGC'));
  console.log(c.dim('  This software is licensed under the MIT License'));
  console.log(c.yellow('═'.repeat(70)) + '\n');
}

module.exports = { showBanner, getBanner, showCopyright };
