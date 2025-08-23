from OPTestAPIv1 import OPTestAPIv1

opta = OPTestAPIv1('http://useast.services.cloud.techzone.ibm.com:39238/openpages/logon.jsp', 'OpenPagesAdministrator', 'OpenPagesAdministrator')
payload = {
    "name": "Teste_criar_registro_199",
    "description": "Possible Fraudulent behavior - Unauthorized Access",
    "objectType": "SOXIssue",
    "primaryParentId": "3156",
    "fields": [
        {
            "isEnum": False,
            "name": "OPSS-Iss:Additional Description",
            "value": "Teste Adição automatizada com todos os processamentos necessários"
        },
        {
            "isEnum": True,
            "name": "OPSS-Iss:Priority",
            "value": "High"
        }
    ],
    "parentAssociationsIds": [20392, 27699],
    "childrenAssociationIds": [789, 556]
}

opta.create_resource(payload)


