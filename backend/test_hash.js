import bcryptjs from 'bcryptjs';

const hashes = [
  {email: 'vicentedesouza762@gmail.com', senha: 'Admin@2026', hash: '$2a$10$LQZO51xgStgLvDLNhKTPNecHix.mvfv6SahJJZEwIW1imF4BUb44a'},
  {email: 'francisco@projeto.com', senha: 'Admin@2026', hash: '$2a$10$DW6Bda13/jZJkt8HInxn9OuY5V7LGZrOGb/0JAcanfG9HIMU28M.G'},
  {email: 'engenheiroteste@projeto.com', senha: 'Engenheiro@123', hash: '$2a$10$EH6q4Gkmdw1iNdk..y4QcuBTNF9H8wKGGi1HcnmmpJPUZX4z2jIOy'}
];

hashes.forEach(h => {
  const isValid = bcryptjs.compareSync(h.senha, h.hash);
  console.log(`${h.email}: ${isValid}`);
});
