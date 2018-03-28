<?php
/**
 * As configurações básicas do WordPress
 *
 * O script de criação wp-config.php usa esse arquivo durante a instalação.
 * Você não precisa usar o site, você pode copiar este arquivo
 * para "wp-config.php" e preencher os valores.
 *
 * Este arquivo contém as seguintes configurações:
 *
 * * Configurações do MySQL
 * * Chaves secretas
 * * Prefixo do banco de dados
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/pt-br:Editando_wp-config.php
 *
 * @package WordPress
 */

// ** Configurações do MySQL - Você pode pegar estas informações com o serviço de hospedagem ** //
/** O nome do banco de dados do WordPress */
define('DB_NAME', 'paulobauer');

/** Usuário do banco de dados MySQL */
define('DB_USER', 'root');

/** Senha do banco de dados MySQL */
define('DB_PASSWORD', 'root');

/** Nome do host do MySQL */
define('DB_HOST', 'localhost');

/** Charset do banco de dados a ser usado na criação das tabelas. */
define('DB_CHARSET', 'utf8mb4');

/** O tipo de Collate do banco de dados. Não altere isso se tiver dúvidas. */
define('DB_COLLATE', '');

/**#@+
 * Chaves únicas de autenticação e salts.
 *
 * Altere cada chave para um frase única!
 * Você pode gerá-las
 * usando o {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org
 * secret-key service}
 * Você pode alterá-las a qualquer momento para invalidar quaisquer
 * cookies existentes. Isto irá forçar todos os
 * usuários a fazerem login novamente.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'fD-Qi$38N,^0])F:Un`.Phr2UQKvLr^A=X9*]GBc%Av~rs[b~Z3ce4[S}/571))J');
define('SECURE_AUTH_KEY',  's+r(PS&^})q8G)[b*PogMo7d%zWU%~ncz@6B.n8H($|^l}JqFpgcr,Z}FU7kt=1!');
define('LOGGED_IN_KEY',    '[g<4yuKY X%L-~>CG&n1p0rF$_ZYpr_FO:( YjzR^UZVy_Cl0d$ciifO?-llj1F)');
define('NONCE_KEY',        'Sg9QIqaXpn~z[P%$G!c]H U|#qbVHh:Zoa+~_;CS|JCb[Nh$u@ltH(m<?es!ZPSp');
define('AUTH_SALT',        ',V1VcvMRB1G0sRA>|;zf7Wu#fm!rVYkn$P2=42u,%/5jPQ~`1pQk!ThUBZY8c}r-');
define('SECURE_AUTH_SALT', '*Z0FCMpxG/33?DY/i&AKMM^RCI$O>ev?_X4%qrR+HcnGv4;lR$%B K|5[$|Yb%?-');
define('LOGGED_IN_SALT',   'Hu&kBT$9b%s>~HD;[4Ve_2zY8May;)7SpLVCbv/s.CBcXzGKUY7(![Mc0QDYR_5!');
define('NONCE_SALT',       'o>ghhsJz96$C`$TX}XYHE--ipw[uo(BXFjDO2U-3/2zxeru-oyt7DwBaOo@p[L$^');

/**#@-*/

/**
 * Prefixo da tabela do banco de dados do WordPress.
 *
 * Você pode ter várias instalações em um único banco de dados se você der
 * um prefixo único para cada um. Somente números, letras e sublinhados!
 */
$table_prefix  = 'wp_paulobauer';

/**
 * Para desenvolvedores: Modo de debug do WordPress.
 *
 * Altere isto para true para ativar a exibição de avisos
 * durante o desenvolvimento. É altamente recomendável que os
 * desenvolvedores de plugins e temas usem o WP_DEBUG
 * em seus ambientes de desenvolvimento.
 *
 * Para informações sobre outras constantes que podem ser utilizadas
 * para depuração, visite o Codex.
 *
 * @link https://codex.wordpress.org/pt-br:Depura%C3%A7%C3%A3o_no_WordPress
 */
define('WP_DEBUG', false);

/* Isto é tudo, pode parar de editar! :) */

/** Caminho absoluto para o diretório WordPress. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Configura as variáveis e arquivos do WordPress. */
require_once(ABSPATH . 'wp-settings.php');
