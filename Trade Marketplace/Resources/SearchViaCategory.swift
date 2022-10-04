//
//  SearchViaCategory.swift
//  Trade Marketplace
//
//  Created by William larsen on 20/09/22.
//

import SwiftUI

struct SearchViaCategory: View {
    @State var Search = ""
    @State var category = ""
    var body: some View {
        RoundedRectangle(cornerRadius: 11)
            .foregroundColor(.gray)
            .opacity(0.19)
            .frame(height: 39)
            .padding(.horizontal, 16)
            .overlay(
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.secondary)
                    TextField("Search in \(category)", text: $Search)
                        .disableAutocorrection(false)
                        .frame(width: 301, height: 45, alignment: .center)
                }
            )
    }
}

struct SearchViaCategory_Previews: PreviewProvider {
    static var previews: some View {
        SearchViaCategory()
    }
}
