//
//  CategorysEnum.swift
//  Trade Marketplace
//
//  Created by William larsen on 8/10/22.
//

import SwiftUI


struct categoryitem: Identifiable   {
    var id = UUID()
    var categorytitle: String
    var categoryimage: String
    var categorycolor: String
}

var categorysvariables = [
    categoryitem(categorytitle: "Electrical", categoryimage: "categoryimage1", categorycolor: "categorycolor1"),
    categoryitem(categorytitle: "Construction", categoryimage: "categoryimage2", categorycolor: "categorycolor2"),
    categoryitem(categorytitle: "Plumbing", categoryimage: "categoryimage3", categorycolor: "categorycolor3"),
    categoryitem(categorytitle: "Gas Fitting", categoryimage: "categoryimage4", categorycolor: "categorycolor4")
]
