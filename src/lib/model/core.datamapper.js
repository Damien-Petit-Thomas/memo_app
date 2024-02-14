export default class CoreDatamapper {
  constructor(client, tablename) {
    this.client = client;
    this.tablename = tablename;
  }

  /**
 * Count the number of rows in the table of the model instance
 * @returns {Promise<number>} - The number of rows in the table
 */

  async count() {
    const count = await this.client.query(
      `SELECT COUNT(id) FROM ${this.tablename}`,
    );
    return Number(count.rows[0].count);
  }

  /**
 * retrieve all rows in the table of the model instance
 * @returns {Promise<Array>} - The list of all rows in the table
 */
  async findAll(id) {
    if (!id) return [];
    const result = await this.client.query(`SELECT * FROM "${this.tablename}" WHERE user_id = $1`, [id]);
    return result.rows;
  }

  /**
*create a row in the table of the model instance
*@param {object} inputData
*@returns {Promise<object>} - The row created in the table
*/

  async create(inputData) {
    const fields = [];
    const values = [];
    const placeholders = [];
    let indexPlaceholder = 1;
    // we use Object.entries to iterate over the object
    Object.entries(inputData).forEach(([key, value]) => {
      fields.push(key);
      values.push(value);
      placeholders.push(`$${indexPlaceholder}`);
      indexPlaceholder += 1;
    });
    const sqlQuery = {
      text:
        `INSERT INTO "${this.tablename}"
        (${fields.join(', ')})
        VALUES (${placeholders.join(', ')}) 
        RETURNING *`,
      values,
    };
    const result = await this.client.query(sqlQuery);
    return result.rows[0];
  }

  /**
 * retrieve one row in the table of the model instance by id
 * @param {number} id
 * @returns {Promise<object>} - The row in the table with the id given in parameter
  */

  async findByPk(id) {
    const query = `SELECT * FROM "${this.tablename}" WHERE id = $1`;
    const values = [id];
    const result = await this.client.query(query, values);
    return result.rows[0];
  }

  async findAllFormated(userId) {
    const sql = 'SELECT * FROM getAllLinksForUser($1) ';
    const values = [userId];
    const response = await this.client.query(sql, values);
    return response.rows;
  }

  async deleteByMemoId(memoId) {
    const sql = `DELETE FROM ${this.tablename} WHERE memo_id = $1`;
    const values = [memoId];
    return this.client.query(sql, values);
  }

  async getMemoContents(memoId) {
    const sql = `SELECT * FROM ${this.tablename} WHERE memo_id = $1`;
    const values = [memoId];
    const response = await this.client.query(sql, values);
    return response.rows;
  }

  async delete(id) {
    const find = await this.findByPk(id);
    if (!find) {
      throw new Error('Not found');
    }
    const result = await this.client.query(`DELETE FROM "${this.tablename}" WHERE id = $1`, [id]);
    return !!result.rowCount;
  }

  findByEmail = async (email) => {
    const response = await this.client.query(
      `SELECT * FROM "${this.tablename}" WHERE email = $1`,
      [email],
    );
    return response.rows[0];
  };

  /**
 * retrieve one row in the table of the model instance by name (case  and accent insensitive)
 * @param {string} inputData
 * @returns {Promise<object>} - The row in the table with the name given in parameter
 */

  async findOneByName(inputData) {
    const query = `SELECT * FROM ${this.tablename} WHERE UNACCENT(name) IlIKE UNACCENT($1)`;
    const values = [`%${inputData}%`];
    const result = await this.client.query(query, values);
    return result.rows;
  }

  /**
     * Modification de données dans la table
     * @param {object} param0 données à mettre à jour dans la table comprenant également
     * l'identifiant de l'enregistrement
     * @returns {object} l'enregistrement mis à jour
     */
  async update(id, inputdata) {
    const fieldsAndPlaceholders = [];
    let indexPlaceholder = 1;
    const values = [];

    Object.entries(inputdata).forEach(([prop, value]) => {
      fieldsAndPlaceholders.push(`"${prop}" = $${indexPlaceholder}`);
      indexPlaceholder += 1;
      values.push(value);
    });

    values.push(id);

    const preparedQuery = {
      text: `
        UPDATE "${this.tablename}" SET
        ${fieldsAndPlaceholders},
        updated_at = now()
        WHERE id = $${indexPlaceholder}
        RETURNING *
      `,
      values,
    };

    const result = await this.client.query(preparedQuery);
    const row = result.rows[0];

    return row;
  }
}
