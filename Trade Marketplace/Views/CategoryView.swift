//
//  CategoryView.swift
//  Trade Marketplace
//
//  Created by William larsen on 20/09/22.
//

import SwiftUI

struct CategoryView: View {
    @State var categoryname = ""
    var body: some View {
        ZStack {
            VStack{
                CategoryNavigator(category: categoryname)
                ScrollView(.vertical){
                    SearchViaCategory()
                    HStack(spacing: 15) {
                        VStack(spacing: 15)
                        {
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                    }
                        VStack(spacing: 15)
                        {
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                                MainObject()
                    }
                    }
                }
            }.ignoresSafeArea()
            VStack{
                Spacer()
                FilterSort()
            }.ignoresSafeArea()
        }.navigationBarBackButtonHidden(true)
            .navigationBarTitleDisplayMode(.inline)
               .navigationBarHidden(true)
    }
}

struct CategoryView_Previews: PreviewProvider {
    static var previews: some View {
        CategoryView()
    }
}
