"""
Gestion des problèmes
Description du fichier 'problem.xml'
    Utilise le fichier 'problems.xml' structuré de la façon suivante :
        <problem id='...'>
        <level>...</level>
        <context>...</context>
        <question>...</question>
        <calcul>...</calcul>
        <solution>...</solution>
        <unite>mol</unite>
        <feedback>
          <feedback id="1" type="true">...</feedback>
          <feedback id="2" type="false">...</feedback>
          <feedback id="3" type="false">...</feedback>
          <feedback id="4" type="false">...</feedback>
        </feedback>
        <help>...</help>
      </problem>

      Les variables sont entourées de '#...#'
      On dispose de :
        - #r...# et #p...# pour les formules des réactifs et produits
        - #nr...# et #np...# pour les quantités de matières
        - #mr...# et #mp...# pour les masses
        - #cr...# et #cp...# pour les coefficients
        - #sr...# et #sp...# pour les noms des espèces
        - #ex...# et #exe...# pour les équations non/oui équilibrées
        - #xmax# pour l'avancement
        - #X# pour la réponse
        - #lim# pour le réactif limitant

      L'item calcul permet le calcul de toues les grandeurs avec la syntaxe :
        - grandeur = ! : calcul automatique ou grandeurs en mémoire
        - grandeur = formule, par ex : round(uniform(1,2),1)

      Les items "solution" et "aide" utilise MathJax. La syntaxe pour les formules est :
        - inline : \(...\)
        - block : $$...$$
        - les balises de formatage html sont encadrées par des crochets [...]

Fonctions:
    - get_problems : récupère la liste des problèmes
    - get_problem : Choisit un problème aléatoire ou identifié par son indice.
    - get_indice_equation : Récupère l'indice de l'équation
    - get_equation : Récupère une équation aléatoire ou définit par #eqX#
    - get_attributes : Récupère les attributs qui sont définis dans les différentes rubriques encadrés par #...#
    - get_values : Définit les valeurs à partir de l'équation ou les calcule grâce aux infos précisées dans <calcul>
    - calc_xmax : Effectue le calcul de xmax avec les données disponibles dans le dict 'values'
    - replace_attributes : Remplace les attributs #...# par leur valeur
    - set_data : Construit le dict des données
    - getProblem : programme principal


"""

import re
import py.constantes as cst
import xmltodict
from equation.Equation import Equation
import json
from random import randrange, uniform
import os
from math import log10

from decimal import *

class Problem:

    FILE_PROBLEMS = os.path.dirname(os.getcwd()) + "/problem/problems.xml"
    R_GET_EQUATION =  re.compile(r'#[eq,eqe]+(\d*)#')
    R_GET_ATTRIBUTES = re.compile(r'#([m,n,r,p,c,X,M,s]{0,1}[^eq][0-9]+)#')
    R_ANALYSE = re.compile(r'#([m,n,r,p,c,a,x,X,M]{1,4}\d?)#=([a-zA-Z0-9*\/\+\-\?\!\(\,.)]*\d?)')
    R_REPLACE = re.compile(r'#([m,n,r,p,c,X,x,a,M,eq,eqe,lim,s]{1,4}\d*)#')
    R_GETCS = re.compile(r'([nmMc][rp]\d)')

    def __init__(self):
        self.problem = None
        self.equation = None  # structure équation
        self.masses_molaires = None  # liste des masses molaires
        self.id_equation = None  # indice de l'équation
        self.id_problem = 0  # numéro du problème
        self.lst_problems = []  # liste des problèmes
        self.reg = None  # Expressions régulières pour problème
        self.tree = None  # arbre xml
        self.root = None  # racine
        self.attributes = []  # liste des attributs
        self.values = {}  # attributs avec valeurs
        self.context = None
        self.question = None
        self.solution = None
        self.id = None
        self.unite = None
        self.feedback = None
        self.help = None

    # récupère liste des problèmes
    def get_problems(self,level = None):
        """
        Récupère la liste des problèmes
        On enregistre la liste dans la structure lst_problemes, on accède à un élément problème par son indice
        Pour chaque problème 'P = lst_probleme[indice]' on accède aux différents attributs A (question, context,...)
        'e' avec A = P.find(e)
        A.tag donne l'identifiant et A.text le contenu
        """
        fd = open(Problem.FILE_PROBLEMS)
        data = xmltodict.parse(fd.read())
        lst = data['problems']['problem']
        tab = []
        if level:
            for e in lst:
                if int(e['level']) == level:
                    tab.append(e)
            self.lst_problems = tab
        else:
            self.lst_problems = lst
        fd.close()

    # Choisit un problème aléatoire ou identifié par son indice.
    # fixe les attributs (context, question,...)
    # l'indice prime sur le niveau
    # Ainsi self.context contiendra le contexte en cours
    def get_problem(self, indice = None):
        if indice == None:
            self.id_problem = randrange(len(self.lst_problems))
            self.problem = self.lst_problems[self.id_problem]
        else:
            self.id_problem = indice
            self.problem = self.lst_problems[indice]
        for tag in self.problem:
            _tag = tag[1:] if tag[0] == '@' else tag
            setattr(self, _tag, self.problem[tag])

    # Récupère l'indice de l'équation
    def get_indice_equation(self):
        for tag in ['context', 'question']:
            if isinstance(self.problem[tag], str):
                equation = Problem.R_GET_EQUATION.findall(self.problem[tag])
                if len(equation) > 0:
                    return int(equation[0])
        return False

    # Récupère une équation aléatoire ou définit par #eqX#
    # Initialise self.equation
    def get_equation(self, id = None):
        eq = Equation()
        lst_equations = eq.get_equations()
        if id == None:  # mode par défaut on utilise une équation aléatoire
            self.equation = lst_equations[randrange(len(lst_equations))]
        else:
            self.equation = lst_equations[id]


        # Calcul des masses molaires
        self.masses_molaires = Equation.get_massesmolaires(self.equation)

    # Récupère les attributs qui sont définis dans les différentes rubriques encadrés par #...#
    # Remplit le tableau self.attributes
    def get_attributes(self):
        for tag in ['context', 'question', 'solution', 'help', 'calcul']:
            if isinstance(self.problem[tag], str):
                form = Problem.R_GET_ATTRIBUTES.findall(self.problem[tag])
                for e in form:
                    if e not in self.attributes:
                        self.attributes.append(e)

    # Définit les valeurs à partir de l'équation ou précisées dans <calcul>
    # Initialise self.values
    def get_values(self, equation):

        # Récupère les formules des réactifs et des produits
        def _get_especes(e, equation):
            # réactifs et produits
            if e[0] in ['r','p']:
                indice = cst.EQ_REACTIF if e[0] == 'r' else cst.EQ_PRODUIT
                return equation[indice][int(e[1])][0]



        # Effectue les calculs à partir des informations stockées dans <calcul>
        # Initialise la structure self.calc@ul {'identifiant': valeur,...}
        def _analyse_calcul():
            attributes = Problem.R_ANALYSE.findall(self.problem['calcul'])
            limitant = None
            precision = None

            for index, elt in enumerate(attributes):
                _elt = list(elt)
                elt = _elt[0]
                if elt[0] == 'M':  # masses molaires
                    indice = int(elt[2]) if elt[1] == 'r' else int(elt[2]) + len(self.equation[cst.EQ_REACTIF])
                    _elt[1] = self.masses_molaires[indice]
                elif elt[0] == 'c':  # coefficients
                    indice = int(elt[2]) if elt[1] == 'r' else int(elt[2]) + len(self.equation[cst.EQ_REACTIF])
                    _elt[1] = self.equation[cst.EQ_COEFFICIENT][indice]
                elif elt == 'xmax':
                    _elt[1], limitant = self.calc_xmax(self.equation)
                else:
                    value = _elt[1]
                    if value == '?':  # valeurs aléatoires
                        if _elt[0][0] == 'n':
                            _elt[1] = round(uniform(0.1, 5), 3)
                        else:
                            _elt[1] = round(uniform(1, 50), 2)
                        precision = 3
                    else:
                        _elt[1] = eval(value)

                elt = tuple(_elt)
                self.values[elt[0]] = elt[1]
                locals()[_elt[0]] = _elt[1]

            # détermination de la precision et mise au norme
            for k in self.values:
                if k[0] == 'n':
                    precision =  2 + int(log10(10 / self.values[k]))
                    break

            for k in self.values:
                if k[0] in ['n', 'm', 'x', 'X']:
                    self.values[k] = round(self.values[k], precision)

            if limitant:
                self.values['lim'] = limitant

        for e in self.attributes:
            self.values[e] = _get_especes(e, self.equation)

        _analyse_calcul()

    # Effectue le calcul de xmax avec les données disponibles dans le dict 'values'
    def calc_xmax(self, equation):

        # calcul de xmax
        nb_reactifs = len(equation[cst.EQ_REACTIF])
        nb_produits = len(equation[cst.EQ_PRODUIT])
        rapports = []
        masses_molaires = None

        tab = []
        for key in self.values.keys():
            if key[0] in ['n', 'm']:
                tab.append(key)
                type = key[1]  # 'r' ou 'p'
                indice = int(key[2]) if key[1] == 'r' else int(key[2]) + nb_produits  # 0,1,...
                coeff = 'c' + key[1:]

                if key[0] == 'n':
                    rapports.append(self.values[key] / self.values[coeff])
                elif key[0] == 'm':
                    rapports.append(self.values[key] / (self.masses_molaires[indice] * self.values[coeff]))

        xmax = min(rapports)
        index = rapports.index(xmax)
        limitant = tab[index][1:]
        if limitant[0] == 'r':
            limitant = self.equation[cst.EQ_REACTIF][int(limitant[1])][0]
        else:
            limitant = self.equation[cst.EQ_PRODUIT][int(limitant[1])][0]
        return xmax, limitant

    # Remplace les attributs #...# par leur valeur
    def replace_attributes(self, text):
        attributes = Problem.R_REPLACE.findall(text)
        for index, elt in enumerate(attributes):
            if elt[0:3] == 'eqe':
                text = text.replace('#' + elt + '#', str(self.equation[cst.EQ_STR]))
            elif elt[0:2] == 'eq':
                text = text.replace('#' + elt + '#', str(self.equation[cst.EQ_EQUATION]))
            else:
                text = text.replace('#'+elt+'#',str(self.values[elt]))
        return text

    # Construit le dict des données
    def set_data(self):
        dic = {}
        context = self.replace_attributes(self.context)
        question = self.replace_attributes(self.question)
        solution = self.replace_attributes(self.solution)

        dic['id'] = int(self.id)
        dic['context'] = context
        dic['question'] = question
        dic['unite'] = self.unite
        dic['valeur'] = self.values['X']
        dic['feedback'] = self.feedback['feedback']
        dic['help'] = self.help
        dic['solution'] = solution
        if 'xmax' in self.values:
            dic['xmax'] = self.values['xmax']
            dic['lim'] = self.values['lim']
        return dic

    # Programme Principal
    def getProblem(self, level):
        self.get_problems(level)
        self.get_problem(2)
        id_equation = self.get_indice_equation()
        self.get_equation(id_equation)
        self.get_attributes()
        self.get_values(self.equation)
        return self.set_data()
