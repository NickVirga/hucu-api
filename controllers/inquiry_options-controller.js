const knex = require("knex")(require("../knexfile"));

const findOne = (req, res) => {
  knex("inquiry_options")
    .where({ organization_id: req.params.id })
    .select("id", "parent_id", "name")

    .then((optionsFound) => {
      if (optionsFound.length === 0) {
        return res.status(404).json({
          message: `Inquiry options for organization with ID: ${req.params.id} not found`,
        });
      }

      const rootNode = optionsFound.find(
        (option) => option.name === "root" && option.parent_id === null
      );

      const buildTreeRecursive = (options, parentId = null) => {
        const children = options
          .filter((option) => option.parent_id === parentId)
          .map((option) => {
            const childNode = {
              key: option.id,
              title: option.name,
            };
            const subChildren = buildTreeRecursive(optionsFound, option.id);
            if (subChildren && subChildren.length > 0) {
              childNode.children = subChildren;
            }
            return childNode;
          });

        return children.length > 0 ? children : null;
      };

      const treeData = buildTreeRecursive(optionsFound, rootNode.id);

      res.status(200).json(treeData);
    })
    .catch((err) => {
      res.status(500).json({
        message: `Unable to retrieve inquiry options for organzation with ID: ${req.params.id}`,
      });
    });
};

module.exports = {
  findOne,
};
